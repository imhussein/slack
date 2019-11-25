module.exports = class Namespace {
  constructor(id, nameSpaceTitle, image, endpoint) {
    this.id = id;
    this.nameSpaceTitle = nameSpaceTitle;
    this.image = image;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(room) {
    this.rooms.push(room);
  }
};
