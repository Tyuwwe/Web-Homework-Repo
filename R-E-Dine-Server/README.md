# R-E-Dine-Server

## Create Tables:

```sql
-- Create the 'users' table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer'
);

-- Create the 'orders' table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_status BOOLEAN DEFAULT FALSE,
    distance FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the 'dishes' table
CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    restaurant VARCHAR(50) NOT NULL
);

-- Create the 'order_details' table
CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    dish_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (dish_id) REFERENCES dishes(id)
);

-- Written by ChatGPT 3.5
```

## Example Dishes:

```sql
INSERT INTO dishes (name, description, price, image_url, restaurant)
VALUES
    ('糖醋里脊', '糖醋里脊以猪里脊肉为主材，配以面粉、淀粉、醋、番茄酱等佐料，酸甜可口，让人食欲大开。', 28, 'https://ooo.0x0.ooo/2023/11/11/OeeuO6.jpg', 'chinese'),
    ('油焖大虾', '大对虾，使用鲁菜特有的油焖技法。其是一道历史悠久的名菜。', 38, 'https://ooo.0x0.ooo/2023/11/11/Oee3Eb.jpg', 'chinese'),
    ('木须肉', '木须肉原名木樨肉，是一道常见的特色传统名菜', 28, 'https://ooo.0x0.ooo/2023/11/11/Oee991.jpg', 'chinese'),
    ('九转大肠', '九转大肠是以猪大肠为主料，加以葱、姜、芫荽等配料，通过煮、烧等烹饪技法制作而成。', 48, 'https://ooo.0x0.ooo/2023/11/11/OeefFM.jpg', 'chinese'),
    ('黄焖鸡', '黄焖鸡由鸡肉、土豆、胡萝卜、葱、姜、蒜、酱油、糖、醋、味精等制成。', 28, 'https://ooo.0x0.ooo/2023/11/11/OeecOv.webp', 'chinese'),
    ('松鼠鳜鱼', '松鼠鳜鱼由鳜鱼、蛋清、淀粉、葱、姜、蒜、酱油、糖、醋、味精等制成。', 48, 'https://ooo.0x0.ooo/2023/11/11/Oee2TI.jpg', 'chinese'),
    ('金陵烤鸭', '金陵烤鸭是中国传统名菜，属于江苏菜系。', 38, 'https://ooo.0x0.ooo/2023/11/11/OeeQvU.webp', 'chinese'),
    ('文思豆腐', '文思豆腐是中国传统名菜，属于江苏菜系。', 18, 'https://ooo.0x0.ooo/2023/11/11/OeeINP.webp', 'chinese'),
    ('同安封肉', '同安封肉是中国传统名菜，属于福建菜系。', 38, 'https://ooo.0x0.ooo/2023/11/11/Oee8dF.jpg', 'chinese'),
    ('面线糊', '面线糊起源于泉州府。', 18, 'https://ooo.0x0.ooo/2023/11/11/OeelPG.jpg', 'chinese'),
    ('佛跳墙', '佛跳墙是中国传统名菜，属于福建菜系。', 48, 'https://ooo.0x0.ooo/2023/11/11/OeeScY.webp', 'chinese'),
    ('莆田卤面', '莆田卤面是中国传统名菜，属于福建菜系。', 28, 'https://ooo.0x0.ooo/2023/11/11/OeeGTp.webp', 'chinese'),
    ('沙茶面', '沙茶面是中国传统名菜，属于福建菜系。', 28, 'https://ooo.0x0.ooo/2023/11/11/Oee6vD.jpg', 'chinese'),
    ('食不食油饼', '食不食油饼是中国传统名菜，属于鲲鲲菜系。', 18, 'https://ooo.0x0.ooo/2023/11/11/OerBdS.jpg', 'chinese'),
    ('大碗宽面', '大碗宽面是中国传统名菜，属于陕西菜系。', 18, 'https://ooo.0x0.ooo/2023/11/11/OerbEL.jpg', 'chinese'),
    ('香翅捞饭', '香翅捞饭是中国传统名菜，属于鲲鲲菜系。', 38, 'https://ooo.0x0.ooo/2023/11/11/OerkIi.webp', 'chinese'),
    ('香菜凤仁鸡', '香菜凤仁鸡是中国传统名菜，属于鲲鲲菜系。', 38, 'https://ooo.0x0.ooo/2023/11/11/OerFRt.jpg', 'chinese'),
    ('蒸虾头', '蒸虾头是中国传统名菜，属于鲲鲲菜系。', 38, 'https://ooo.0x0.ooo/2023/11/11/Oerhjx.jpg', 'chinese'),
    ('法式焗蜗牛', '法式焗蜗牛是一种源自法国的食品，是法国风味餐的代表。', 48, 'https://ooo.0x0.ooo/2023/11/11/OerKIc.jpg', 'western'),
    ('奶油口蘑汤', '奶油口蘑汤是一种源自法国的食品，是法国风味餐的代表。', 28, 'https://ooo.0x0.ooo/2023/11/11/OerAGq.jpg', 'western'),
    ('罗勒鲜虾意大利面', '罗勒是一种西式香草，用来制作意大利面口味非常好', 28, 'https://ooo.0x0.ooo/2023/11/11/OernUj.jpg', 'western'),
    ('法式龙虾浓汤', '法式龙虾浓汤是一种源自法国的食品，是法国风味餐的代表。', 38, 'https://ooo.0x0.ooo/2023/11/11/Oervhr.webp', 'western'),
    ('白烩小牛肉', '白烩小牛肉是一种源自法国的食品，是法国风味餐的代表。', 48, 'https://ooo.0x0.ooo/2023/11/11/OerpW1.jpg', 'western'),
    ('香精煎鱼', '你是不是香精煎鱼！', 38, 'https://ooo.0x0.ooo/2023/11/11/OerJyI.jpg', 'western');

```
