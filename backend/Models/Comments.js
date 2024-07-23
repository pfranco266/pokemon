import { DataTypes, Model } from '@sequelize/core';

import sequelize from "../Connection/connection.js";

class Comments extends Model {}

Comments.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 251], 
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pokemonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize, // Use the imported Sequelize instance
    modelName: 'Comments',
    timestamps: false,
  });





export default Comments;
