import {UserEmail} from "./UserEmail";
import {UserPassword} from "./UserPassword";

export class User {
    constructor(username, password, email, name, phone, rolesId, address, isApproved = false, warehouseId = null, parentId = null) {
        try {
            this.username = username;
            this.setEmail(email);
            this.setPassword(password);
            this.name = name;
            this.phone = phone;
            this.rolesId = rolesId;
            this.isApproved = isApproved;
            this.address = address;
            this.warehouseId = warehouseId;
            this.parentId = parentId;
        } catch (exception) {
            throw exception;
        }

    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    setEmail(value) {
        this.email = new UserEmail(value);
    }

    setPassword(value) {
        this.password = new UserPassword(value);
    }
}
