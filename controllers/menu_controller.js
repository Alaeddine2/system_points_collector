const user_schema = require("../schemas/menu_schema");
const jwtContainer = require("../middleware/json_web_token");
const logger = require('../middleware/logging_middleware');

class MenuController {

  constructor() {}

    async getAll(req, res) {
        try {
        const all = await user_schema.find();
        //res.json(all);
            logger.info(`get all menu items [Path: v1/menu/all] ${all}`)
            res.status(200).json({
                code: "API.ALLMENU.GET.SUCESS",
                message: "all Menu items",
                success: true,
                data: all
            });
        } catch (err) {
        
            logger.error(`get all menu items [Path: v1/menu/all] ${err}`)
            res.status(500).json({
                code: "API.ALLMENU.GET.ERROR",
                message: "Error getting all Menu items",
                success: false,
                data: err
            });
        }
    }

    async getOne(req, res) {
        try {
        const one = await user_schema.findById(req.params.id);
        //res.json(one);
            logger.info(`get one menu item [Path: v1/menu/all/:id] ${one}`)
            res.status(200).json({
                code: "API.ONEMENU.GET.SUCESS",
                message: "one Menu item",
                success: true,
                data: one
            });
        } catch (err) {
            logger.error(`get one menu item [Path: v1/menu/all/:id] ${err}`)
            res.status(500).json({
                code: "API.ONEMENU.GET.ERROR",
                message: "Error getting one Menu item",
                success: false,
                data: err
            });
        }
    }

    async addNewMenu(req, res) {
        try {
        const newMenu = new user_schema(req.body);
        const saved = await newMenu.save();
        //res.json(saved);
            logger.info(`add new menu item [Path: v1/menu/add] ${saved}`)
            res.status(200).json({
                code: "API.ADDMENU.POST.SUCESS",
                message: "Menu item added",
                success: true,
                data: saved
            });
        } catch (err) {
            logger.error(`add new menu item [Path: v1/menu/add] ${err}`)
            res.status(500).json({
                code: "API.ADDMENU.POST.ERROR",
                message: "Error adding Menu item",
                success: false,
                data: err
            });
        }
    }

    async updateMenu(req, res) {
        try {
        const updated = await user_schema.findByIdAndUpdate(req.params.id, req.body, {new: true});
        //res.json(updated);
            logger.info(`update menu item [Path: v1/menu/update/:id] ${updated}`)
            res.status(200).json({
                code: "API.UPDATEMENU.PUT.SUCESS",
                message: "Menu item updated",
                success: true,
                data: updated
            });
        } catch (err) {
            logger.error(`update menu item [Path: v1/menu/update/:id] ${err}`)
            res.status(500).json({
                code: "API.UPDATEMENU.PUT.ERROR",
                message: "Error updating Menu item",
                success: false,
                data: err
            });
        }
    }

    async deleteMenu(req, res) {
        try {
        const deleted = await user_schema.findByIdAndRemove(req.params.id);
        //res.json(deleted);
            logger.info(`delete menu item [Path: v1/menu/:id] ${deleted}`)
            res.status(200).json({
                code: "API.DELETEMENU.DELETE.SUCESS",
                message: "Menu item deleted",
                success: true,
                data: deleted
            });
        } catch (err) {
            logger.error(`delete menu item [Path: v1/menu/:id] ${err}`)
            res.status(500).json({
                code: "API.DELETEMENU.DELETE.ERROR",
                message: "Error deleting Menu item",
                success: false,
                data: err
            });
        }
    }
}

module.exports = MenuController;