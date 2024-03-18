const user_schema = require("../schemas/menu_schema");
const category_schema = require("../schemas/categories_schema");
const jwtContainer = require("../middleware/json_web_token");
const logger = require('../middleware/logging_middleware');
const userMethodes = require("../utils/user");
class MenuController {

  constructor() {}
    async addNewCategory(req, res) {
        try {
            // test if the user is professional
            const currentUser = userMethodes.getUserFromToken(req);
            if(currentUser.user.role_number != 1) {
                logger.error(`add new category [Path: v1/menu/add/category] ${currentUser.role} is not allowed to add categories`)
                res.status(500).json({
                    code: "API.ADDCATEGORY.POST.ERROR",
                    message: "Error adding Category",
                    success: false,
                    data: "You are not allowed to add categories"
                });
                return;
            }

            const newCategory = new category_schema(req.body);
            const saved = await newCategory.save();
            //res.json(saved);
            logger.info(`add new category [Path: v1/menu/add/category] ${saved}`)
            res.status(200).json({
                code: "API.ADDCATEGORY.POST.SUCESS",
                message: "Category added",
                success: true,
                data: saved
            });
        } catch (err) {
            logger.error(`add new category [Path: v1/menu/add/category] ${err}`)
            res.status(500).json({
                code: "API.ADDCATEGORY.POST.ERROR",
                message: "Error adding Category",
                success: false,
                data: err
            });
        }
    }

    async updateCategory(req, res) {
        try {
            // test if the user is professional
            const currentUser = userMethodes.getUserFromToken(req);
            if(currentUser.user.role_number != 1) {
                logger.error(`update category [Path: v1/menu/update/category/:id] ${currentUser.role} is not allowed to update categories`)
                res.status(500).json({
                    code: "API.UPDATECATEGORY.PUT.ERROR",
                    message: "Error updating Category",
                    success: false,
                    data: "You are not allowed to update categories"
                });
                return;
            }

            const updated = await category_schema.findByIdAndUpdate
            (req.params.id, req.body, {new: true});
            //res.json(updated);
            logger.info(`update category [Path: v1/menu/update/category/:id] ${updated}`)
            res.status(200).json({
                code: "API.UPDATECATEGORY.PUT.SUCESS",
                message: "Category updated",
                success: true,
                data: updated
            });
        } catch (err) {
            logger.error(`update category [Path: v1/menu/update/category/:id] ${err}`)
            res.status(500).json({
                code: "API.UPDATECATEGORY.PUT.ERROR",
                message: "Error updating Category",
                success: false,
                data: err
            });
        }
    }

    async getAllCategories(req, res) {
        try {
            const all = await category_schema.find({});
            //res.json(all);
            logger.info(`get all categories [Path: v1/menu/categories/all] ${all}`)
            res.status(200).json({
                code: "API.ALLCATEGORIES.GET.SUCESS",
                message: "all Categories",
                success: true,
                data: all
            });

        } catch (err) {
            logger.error(`get all categories [Path: v1/menu/categories/all] ${err}`)
            res.status(500).json({
                code: "API.ALLCATEGORIES.GET.ERROR",
                message: "Error getting all Categories",
                success: false,
                data: err
            });
        }
    }

    async getAll(req, res) {
        try {
        const all = await user_schema.find().populate('category');
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
        const one = await user_schema.findById(req.params.id).populate('category');
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
        // test if the user is professional
        const currentUser = userMethodes.getUserFromToken(req);
            if(currentUser.user.role_number != 1) {
            logger.error(`add new menu item [Path: v1/menu/add] ${currentUser.role} is not allowed to add menu items`)
            res.status(500).json({
                code: "API.ADDMENU.POST.ERROR",
                message: "Error adding Menu item",
                success: false,
                data: "You are not allowed to add menu items"
            });
            return;
        }
        // add category_id using category field
        //const category = await category_schema.findOne({name: req.body.category});
        req.body.category_id = req.body.category
        // add menu item
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