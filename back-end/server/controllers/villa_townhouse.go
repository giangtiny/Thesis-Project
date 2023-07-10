package controllers

import (
	"encoding/json"
	"strings"
	"trebooking/models"
	"trebooking/services/fileio"
	"trebooking/utils"

	"github.com/beego/beego/v2/server/web"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type VillaTownhouseController struct {
	web.Controller
}

func (v *VillaTownhouseController) GetAll(t uint8) {
	villaTownhouseList, err := models.GetAllVillaTownhouse(t)
	if err != nil {
		v.CustomAbort(500, err.Error())
	}
	if len(villaTownhouseList) != 0 {
		v.Data["json"] = villaTownhouseList
	} else {
		v.Data["json"] = []models.VillaTownhouse{}
	}
	err = v.ServeJSON()
	if err != nil {
		v.Abort(err.Error())
	}
}

func (v *VillaTownhouseController) GetAllSpecialVillaTownhouse(t uint8) {
	villalist, err := models.GetAllSpecialVillaTownhouse(t)
	if err != nil {
		v.CustomAbort(500, err.Error())
	}
	if len(villalist) != 0 {
		v.Data["json"] = villalist
	} else {
		v.Data["json"] = []models.VillaTownhouse{}
	}
	err = v.ServeJSON()
	if err != nil {
		v.Abort(err.Error())
	}
}

func (v *VillaTownhouseController) CreateVillaTownhouse() {
	token := v.Ctx.Request.Header.Get("Authorization")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	if err != nil {
		v.Abort("Error")
	}
	if !check {
		v.CustomAbort(401, "Permission denied")
	}

	var villaTownhouse models.VillaTownhouse
	err = json.Unmarshal(v.Ctx.Input.RequestBody, &villaTownhouse)
	if err != nil {
		v.CustomAbort(500, err.Error())
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateStringEmpty(villaTownhouse.Name, "Name"),
		utils.ValidateStringEmpty(villaTownhouse.Address, "Address"),
		utils.ValidateStringEmpty(villaTownhouse.Description, "Description"),
	)
	if !isValid {
		v.Ctx.Output.Header("Content-Type", "application/json")
		v.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.CreateVillaTownhouse(&villaTownhouse)
	if err != nil {
		v.CustomAbort(500, err.Error())
	}
	v.Data["json"] = result
	err = v.ServeJSON()
	if err != nil {
		v.Abort(err.Error())
	}
}

func (v *VillaTownhouseController) GetVillaTownhouse() {
	id := v.GetString(":id")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		v.Ctx.Output.Header("Content-Type", "application/json")
		v.CustomAbort(400, strings.Join(msg, ""))
	}
	villaTownhouse, err := models.GetVillaTownhouse(id)
	if err != nil {
		v.CustomAbort(500, err.Error())
	}
	if villaTownhouse == nil {
		v.Data["json"] = models.VillaTownhouse{}
	} else {
		v.Data["json"] = villaTownhouse
	}
	err = v.ServeJSON()
	if err != nil {
		v.Abort(err.Error())
	}
}

func (v *VillaTownhouseController) GetPagedVillaTownhouse(t uint8) {
	offset, err := v.GetInt("offset")
	if err != nil {
		v.CustomAbort(400, "Offset is invalid")
	}
	maxPerPage, err := v.GetInt("maxperpage")
	if err != nil {
		v.CustomAbort(400, "Max Villa per page is invalid")
	}
	if offset < 0 || maxPerPage < 1 {
		v.CustomAbort(400, "Offset and max villa per page is invalid")
	}
	result, err := models.GetPagedVillaTownhouse(t, offset, maxPerPage)
	if err != nil {
		v.CustomAbort(500, "Error database")
	}
	v.Data["json"] = result
	err = v.ServeJSON()
	if err != nil {
		v.Abort(err.Error())
	}
}

func (v *VillaTownhouseController) UpdateVillaTownhouse() {
	token := v.Ctx.Request.Header.Get("Authorization")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	if err != nil {
		v.Abort("Error")
	}
	if !check {
		v.CustomAbort(401, "Permission denied")
	}
	var villaTownhouse models.VillaTownhouse
	body := v.Ctx.Input.RequestBody
	if err := json.Unmarshal(body, &villaTownhouse); err != nil {
		v.CustomAbort(400, err.Error())
	}

	villaTownhouseId := v.GetString(":id")
	if villaTownhouseId == "" {
		v.CustomAbort(400, "VillaId is empty")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(villaTownhouseId),
		utils.ValidateStringEmpty(villaTownhouse.Name, "Name"),
		utils.ValidateStringEmpty(villaTownhouse.Address, "Address"),
		utils.ValidateStringEmpty(villaTownhouse.Description, "Description"),
	)
	if !isValid {
		v.Ctx.Output.Header("Content-Type", "application/json")
		v.CustomAbort(400, strings.Join(msg, ""))
	}
	villaTownhouse.ID, _ = primitive.ObjectIDFromHex(villaTownhouseId)
	if result, err := models.UpdateVillaTownhouse(&villaTownhouse); err != nil {
		v.CustomAbort(500, err.Error())
	} else {
		v.Data["json"] = result
	}
	if err := v.ServeJSON(); err != nil {
		v.Abort(err.Error())
	}
}

func (v *VillaTownhouseController) CalculateVillaTownhouseFee() {
	var input struct {
		VillaTownhouseID string
		CheckIn          primitive.DateTime
		CheckOut         primitive.DateTime
	}
	if err := json.Unmarshal(v.Ctx.Input.RequestBody, &input); err != nil {
		v.CustomAbort(400, err.Error())
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(input.VillaTownhouseID),
		utils.ValidateCheckInCheckOutTime(input.CheckIn, input.CheckOut),
	)
	if !isValid {
		v.Ctx.Output.Header("Content-Type", "application/json")
		v.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.CalculateVillaTownhouseFee(input.VillaTownhouseID, input.CheckIn, input.CheckOut)
	if err != nil {
		v.CustomAbort(400, err.Error())
	}
	v.Data["json"] = result
	err = v.ServeJSON()
	if err != nil {
		v.Abort(err.Error())
	}
}

func (v *VillaTownhouseController) DeleteVillaTownhouse() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	villaID := v.GetString(":id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(villaID),
	); !isValid {
		v.Ctx.Output.Header("Content-Type", "application/json")
		v.CustomAbort(400, strings.Join(msg, "Not found id: "+villaID))
	}

	if err := models.DeleteVillaTownhouse(villaID); err != nil {
		v.CustomAbort(404, err.Error())
	}
	v.Data["json"] = "Successfully deleted 1 villa"
	if err := v.ServeJSON(); err != nil {
		v.CustomAbort(500, err.Error())
	}
}

func (v *VillaTownhouseController) AddImagesVillaTownhouse() {
	// token := h.Ctx.Request.Header.Get("Authorization")
	// check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	// if err != nil {
	// 	h.Abort(err.Error())
	// }
	// if !check {
	// 	h.CustomAbort(401, "Permission denied")
	// }
	villaTownhouseID := v.GetString(":id")
	typeImage := v.GetString(":images")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(villaTownhouseID),
	)
	if !isValid {
		v.Ctx.Output.Header("Content-Type", "application/json")
		v.CustomAbort(400, strings.Join(msg, ""))
	}
	files := v.Ctx.Request.MultipartForm.File[typeImage]
	if err := fileio.UploadImages(&files); err != nil {
		v.CustomAbort(400, err.Error())
	}
	if err := models.AddImagesVillaTownhouse(villaTownhouseID, files, typeImage); err != nil {
		v.CustomAbort(400, err.Error())
	}
	v.CustomAbort(200, "Success")
}

func (v *VillaTownhouseController) RemoveImagesVillaTownhouse() {
	//token := v.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	//if err != nil {
	//	v.Abort(err.Error())
	//}
	//if !check {
	//	v.CustomAbort(401, "Permission denied")
	//}

	villaTownhouseID := v.GetString(":id")
	typeImage := v.GetString(":images")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(villaTownhouseID),
	)
	if !isValid {
		v.Ctx.Output.Header("Content-Type", "application/json")
		v.CustomAbort(400, strings.Join(msg, ""))
	}
	var inp = make(map[string][]string)
	if err := json.Unmarshal(v.Ctx.Input.RequestBody, &inp); err != nil {
		v.CustomAbort(400, err.Error())
	}
	imageNames := inp["name"]
	if err := fileio.RemoveImages(imageNames); err != nil {
		v.CustomAbort(400, err.Error())
	}
	if err := models.RemoveImagesVillaTownhouse(villaTownhouseID, imageNames, typeImage); err != nil {
		v.CustomAbort(400, err.Error())
	}
	v.CustomAbort(200, "Success")
}
