import PositionedObject from '../common/PositionedObject';
import ClientGameObject from './ClientGameObject';
import ClientPlayer from './ClientPlayer';

class ClientCell extends PositionedObject {
  constructor(cfg) {
    super();
    const { cellWidth, cellHeight } = cfg.world;

    Object.assign(
      this,
      {
        cfg,
        objects: [],
        x: cellWidth * cfg.cellCol,
        y: cellWidth * cfg.cellRow,
        width: cellWidth,
        height: cellHeight,
        col: cfg.cellCol,
        row: cfg.cellRow,
        objectClasses: { player: ClientPlayer },
      },
      cfg,
    );

    this.initGameObjects();
  }

  initGameObjects() {
    const { cellCfg, objectClasses } = this;

    this.objects = cellCfg.map((layer, layerId) =>
      layer.map((objCfg) => {
        let ObjectClasses;

        if (objCfg.class) {
          ObjectClasses = objectClasses[objCfg.class];
        } else {
          ObjectClasses = ClientGameObject;
        }

        return new ObjectClasses({
          cell: this,
          objCfg,
          layerId,
        });
      }),
    );
  }

  render(time, layerId) {
    const { objects } = this;

    if (objects[layerId]) {
      objects[layerId].forEach((obj) => obj.render(time));
    }
  }

  addGameObject(objToAdd) {
    const { objects } = this;

    const objToAdd1 = objToAdd;
    if (objToAdd1.layerId === undefined) {
      objToAdd1.layerId = objects.length;
    }

    if (!objects[objToAdd1.layerId]) {
      objects[objToAdd1.layerId] = [];
    }

    objects[objToAdd1.layerId].push(objToAdd1);
  }

  removeGameObject(objToRemove) {
    const { objects } = this;

    objects.forEach((layer, layerId) => (objects[layerId] = layer.filter((obj) => obj !== objToRemove)));
  }

  findObjectsByType(type) {
    let foundObjects = [];
    const { objects } = this;

    objects.forEach((layer) => (foundObjects = [...foundObjects, ...layer].filter((obj) => obj.type === type)));

    return foundObjects;
  }
}

export default ClientCell;
