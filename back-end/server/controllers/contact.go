package controllers

import (
	"encoding/json"
	"trebooking/models"
	"trebooking/utils"

	"github.com/beego/beego/v2/server/web"
)

type ContactController struct {
	web.Controller
}

// // CreateContact @Title Get
// // @Description create contact
// // @Success 200
// // @router /contact [post]
// func (c *ContactController) CreateContact() {
// 	token := c.Ctx.Request.Header.Get("Authorization")
// 	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
// 	if err != nil {
// 		c.Abort("Error")
// 	}
// 	if !check {
// 		c.CustomAbort(401, "Permission denied")
// 	}
// 	var contact models.Contact
// 	err = json.Unmarshal(c.Ctx.Input.RequestBody, &contact)
// 	if err != nil {
// 		c.CustomAbort(400, err.Error())
// 	}
// 	result, err := models.CreateContact(&contact)
// 	if err != nil {
// 		c.CustomAbort(500, err.Error())
// 	}
// 	c.Data["json"] = result
// 	if err := c.ServeJSON(); err != nil {
// 		c.CustomAbort(500, err.Error())
// 	}
// }

// UpdateContact @Title Get
// @Description update contact
// @Success 200
// @router /contact [put]
func (c *ContactController) UpdateContact() {
	token := c.Ctx.Request.Header.Get("Authorization")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	if err != nil {
		c.Abort("Error")
	}
	if !check {
		c.CustomAbort(401, "Permission denied")
	}
	var contact models.Contact
	err = json.Unmarshal(c.Ctx.Input.RequestBody, &contact)
	if err != nil {
		c.CustomAbort(400, err.Error())
	}
	result, err := models.UpdateContact(&contact)
	if err != nil {
		c.CustomAbort(500, err.Error())
	}
	c.Data["json"] = result
	if err := c.ServeJSON(); err != nil {
		c.CustomAbort(500, err.Error())
	}
}

// GetContact @Title Get
// @Description get contact
// @Success 200
// @router /contact [get]
func (c *ContactController) GetContact() {
	result, err := models.GetContact()
	if err != nil {
		c.CustomAbort(500, err.Error())
	}
	c.Data["json"] = result
	if err := c.ServeJSON(); err != nil {
		c.CustomAbort(500, err.Error())
	}
}
