import { Model, DataTypes } from "sequelize"
import { sequelize } from "./index"
 
export class Comercios extends Model {
  declare nombre: string
  declare direccion: string
  declare descripcion:string
  declare latitud: number
  declare longitud: number
}

Comercios.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latitud:{
    type:DataTypes.FLOAT,
    allowNull: false
  },
  longitud: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: "Comercios",
  tableName: "Comercios",
  freezeTableName: true
})




