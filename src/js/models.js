class ContentManager {
    constructor () {
        // Счетчик, который хранит id, который будет присвоен новому контенту
        this._nextContentId = 20;
    }

    createContent (title, type, link, creator, image, description) {
        // Создаем объект новой комнаты
        let content = new Content(this._nextContentId++, type, title, link, creator, image, description);
        return content;
    }
    // Контент по id
    getContentById (id) {
        return this.contents[id];
    }
}

class Content {
    constructor(id, type, title, link, creator, image, description) {
        this.id = id;
        this.add_time = new Date();
        this.type = type;
        this.title = title;
        this.link = link;
        this.creator = creator || 'unknown';
        this.image = image;
        this.description = description;
    }
    toJson () {
        // Приведем объект к тому JSON-представлению, которое отдается клиенту
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            link: this.link,
            creator: this.creator,
            image: this.image,
            description: this.description
        };
    }
}

export { ContentManager, Content };
