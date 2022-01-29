// Model class is what we create our models from using extends keyword so User inherits all of the functionality the Model class has
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create User model
class User extends Model {

    // instance method to run User Instance Data to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
};

// We use .init() to initialize the model's data and configuration passing 2 objects as arguments.
// define table columns and configuration
User.init(
    {
        // THIS OBJECT IS TO DEFINE THE COLUMNS AND DATATYPES FOR THOSE COLUMNS / TABLE COLUMN DEFINITIONS GO HERE / defines an ID column 
        id: {
            //  provide what type of data it is
            type: DataTypes.INTEGER,
            // 'NOT NULL' option
            allowNull: false,
            // Primary Key
            primaryKey: true,
            // auto increment
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // no duplicate email values 
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be of leangth 4
                len: [4]
            }
        }
    },
    {
        hooks: {
            // set up beforeCreate lifecycle 'hook' functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },

            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // THIS OBJECT ACCEPTS CONFIGURES CERTAIN OPTIONS FOR THE TABLE
        // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)
        // pass imported sequelize connection (direct connection to database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;