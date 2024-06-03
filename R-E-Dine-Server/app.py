#R-E-Dine Server Version 1.1b
#License: GPLv3

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # 导入 CORS
app = Flask(__name__)
import random

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/R-E-Dine'

db = SQLAlchemy(app)

# 定义数据模型
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50),default='customer')

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    payment_status = db.Column(db.Boolean, default=False)
    distance = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    def __repr__(self):
        print('Order created:', self.id, self.total_price, self.status, self.payment_status, self.distance, self.created_at)
        return f'<Order {self.id}>'

class OrderDetail(db.Model):
    __tablename__ = 'order_details'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)


class Dish(db.Model):
    __tablename__ = 'dishes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    restaurant = db.Column(db.String(50), nullable=False)

# API路由
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'name': user.name, 'email': user.email} for user in users])

@app.route('/users/<int:userId>', methods=['GET'])
def get_user(userId):
    user = User.query.get(userId)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'id': user.id, 'name': user.name})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user_name = User.query.filter_by(name=username, password=password).first()
    user_email = User.query.filter_by(email=username, password=password).first()
    
    if user_name:
        return jsonify({'role': user_name.role,'id': user_name.id}), 200
    elif user_email:
        return jsonify({'role': user_email.role,'id': user_email.id}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=data['password']
    )
    db.session.add(new_user)
    db.session.commit()

    print('User created:', new_user.id, new_user.name, new_user.email, new_user.role)
    
    return jsonify({'id': new_user.id, 'name': new_user.name, 'email': new_user.email, 'role': new_user.role}), 201


@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json(silent=True)
    if data and 'order_details' in data:
        user_id = data['user_id']
        order_items = data['order_details']

        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        total_price = 0

        for item in order_items:
            dish = db.session.get(Dish, item['dish_id'])
            if not dish:
                return jsonify({'error': f'Dish with id {item["dish_id"]} not found'}), 404
            total_price += dish.price * int(item['quantity'])  

        # 创建新订单记录
        distance = round(random.uniform(1.0, 10.0))
        new_order = Order(user_id=user_id, total_price=total_price, status='Pending',distance=distance)
        db.session.add(new_order)
        db.session.flush()

        # 创建订单详情记录
        for item in order_items:
            order_detail = OrderDetail(
                order_id=new_order.id,
                dish_id=item['dish_id'],
                quantity=item['quantity']
            )
            db.session.add(order_detail)

        db.session.commit()

        # 新增日志
        print('Order created:', new_order.id, new_order.total_price, new_order.status, new_order.payment_status, new_order.distance, new_order.created_at)

        return jsonify({
            'order_id': new_order.id,
            'total_price': str(total_price),
            'status': new_order.status
        }), 201
    else:
        return jsonify({'error': 'Invalid order data'}), 400

@app.route('/orders', methods=['GET'])
def get_all_orders():
    # 查询数据库获取所有订单，包括关联的用户信息和订单详情
    orders = Order.query.all()
    orders_data = []
    for order in orders:
        # 获取与该订单相关的所有订单详情
        order_details = OrderDetail.query.filter_by(order_id=order.id).all()
        details_list = []
        for detail in order_details:
            # 获取与订单详情相关的菜品信息
            dish = Dish.query.get(detail.dish_id)
            if dish:
                details_list.append({
                    'dish_id': detail.dish_id,
                    'name': dish.name,
                    'quantity': detail.quantity,
                    'price': str(dish.price)
                })
        orders_data.append({
            'order_id': order.id,
            'user_id': order.user_id,
            'total_price': str(order.total_price),
            'status': order.status,
            'created_at': order.created_at.isoformat(),
            'order_details': details_list,
            'distance': round(order.distance, 2),
        })
    return jsonify(orders_data), 200

@app.route('/orders/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # 查询订单详情
    order_details = OrderDetail.query.filter_by(order_id=order.id).all()
    details_list = []
    for detail in order_details:
        dish = Dish.query.get(detail.dish_id)
        if dish:
            details_list.append({
                'dish_id': detail.dish_id,
                'name': dish.name,
                'quantity': detail.quantity,
                'price': str(dish.price)
            })
            
    order_data = {
        'order_id': order.id,
        'user_id': order.user_id,
        'total_price': str(order.total_price),
        'status': order.status,
        'created_at': order.created_at.isoformat(),
        'order_details': details_list,
        'distances': order.distance
    }

    return jsonify(order_data), 200

@app.route('/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    # 找到对应的订单
    order = Order.query.get(order_id)
    if order is None:
        return jsonify({'error': 'Order not found'}), 404

    OrderDetail.query.filter_by(order_id=order_id).delete()

    db.session.delete(order)
    db.session.commit()

    return jsonify({'message': 'Order and details deleted successfully'}), 200

@app.route('/dishes', methods=['GET'])
def get_dishes_by_type():
    cuisine_type = request.args.get('type', 'all')

    if cuisine_type.lower() == 'chinese':
        dishes = Dish.query.filter_by(restaurant='chinese').all()
    elif cuisine_type.lower() == 'western':
        dishes = Dish.query.filter_by(restaurant='western').all()
    else:
        dishes = Dish.query.all()

    dishes_data = [{
        'id': dish.id,
        'name': dish.name,
        'description': dish.description,
        'price': str(dish.price),
        'image_url': dish.image_url,
        'restaurant': dish.restaurant
    } for dish in dishes]

    return jsonify(dishes_data), 200

@app.route('/admin/dishes', methods=['GET'])
def get_dishes_for_admin():
    admin_username = request.args.get('username')

    admin = User.query.filter_by(name=admin_username).first()

    if not admin or admin.role != 'admin':
        return jsonify({'error': 'Unauthorized or admin not found'}), 403

    if admin.restaurant:
        dishes = Dish.query.filter_by(restaurant=admin.restaurant).all()
        dishes_data = [{
            'id': dish.id,
            'name': dish.name,
            'description': dish.description,
            'price': str(dish.price),
            'image_url': dish.image_url,
            'restaurant': dish.restaurant
        } for dish in dishes]
        return jsonify(dishes_data), 200
    else:
        return jsonify({'error': 'Admin restaurant type not found'}), 404

# 添加新菜品
@app.route('/dishes', methods=['POST'])
def add_dish():
    data = request.get_json()
    new_dish = Dish(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        image_url=data['image_url'],
        restaurant=data['restaurant']
    )
    db.session.add(new_dish)
    db.session.commit()
    return jsonify({
        'id': new_dish.id,
        'message': 'New dish added successfully'
    }), 201

# 查询特定ID菜品信息
@app.route('/dishes/<int:dish_id>', methods=['GET'])
def get_dish_details(dish_id):
    dish = Dish.query.get(dish_id)
    if not dish:
        return jsonify({'error': 'Dish not found'}), 404

    dish_data = {
        'id': dish.id,
        'name': dish.name,
        'description': dish.description,
        'price': str(dish.price),
        'image_url': dish.image_url,
        'restaurant': dish.restaurant
    }

    return jsonify(dish_data), 200

# 更新菜品信息
@app.route('/dishes/<int:dish_id>', methods=['PUT'])
def update_dish(dish_id):
    dish = Dish.query.get(dish_id)
    if dish is None:
        return jsonify({'error': 'Dish not found'}), 404
    
    data = request.get_json()
    dish.name = data['name']
    dish.description = data['description']
    dish.price = data['price']
    dish.image_url = data['image_url']
    dish.restaurant = data['restaurant']
    db.session.commit()
    return jsonify({'message': 'Dish updated successfully'}), 200

# 删除菜品
@app.route('/dishes/<int:dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    dish = Dish.query.get(dish_id)
    if dish is None:
        return jsonify({'error': 'Dish not found'}), 404
    
    db.session.delete(dish)
    db.session.commit()
    return jsonify({'message': 'Dish deleted successfully'}), 200


CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
