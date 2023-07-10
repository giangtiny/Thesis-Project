package controllers

import "trebooking/utils"

type VillaController struct {
	VillaTownhouseController
}

// GetAllVilla
// Get @Title Get all villa
// @Description Get all villa
// @Success 200
// @router /villa/all [get]
func (v *VillaController) GetAllVilla() {
	v.VillaTownhouseController.GetAll(utils.VILLA)
}

// GetAllSpecialVilla
// Get @Title Get all villa
// @Description Get all villa
// @Success 200
// @router /villa/all/special [get]
func (v *VillaController) GetAllSpecialVilla() {
	v.VillaTownhouseController.GetAllSpecialVillaTownhouse(utils.VILLA)
}

// CreateVilla
// Post @Title Create villa
// @Description Create villa
// @Success 200
// @router /villa [post]
func (v *VillaController) CreateVilla() {
	v.VillaTownhouseController.CreateVillaTownhouse()
}

// GetVilla
// Get @Title Get villa
// @Description Get villa
// @Success 200
// @Param id path string true "Id of villa"
// @router /villa/:id [get]
func (v *VillaController) GetVilla() {
	v.VillaTownhouseController.GetVillaTownhouse()
}

// GetPagedVilla
// Get @Title Get Paged villa
// @Description Get Paged villa
// @Success 200
// @Param offset query int true "offset"
// @Param maxperpage query int true "max villa per page"
// @router /villa [get]
func (v *VillaController) GetPagedVilla() {
	v.VillaTownhouseController.GetPagedVillaTownhouse(utils.VILLA)
}

// UpdateVilla
// Put @Title Update Information villa
// @Description Update information villa
// @Success 200
// @Param id query int true "offset"
// @Param villa body models.Villa true "information"
// @router /villa/:id [put]
func (v *VillaController) UpdateVilla() {
	v.VillaTownhouseController.UpdateVillaTownhouse()
}

// CalculateVillaFee
// Post @Title Calculate villa fee
// @Description Calculate villa fee
// @Success 200
// @router /villa/calculate [post]
func (v *VillaController) CalculateVillaFee() {
	v.VillaTownhouseController.CalculateVillaTownhouseFee()
}

// DeleteVilla @Title Delete villa
// @Description Delete villa by ID
// @Param id path string true "Id of villa"
// @Success 200
// @router /villa/:id [delete]
func (v *VillaController) DeleteVilla() {
	v.VillaTownhouseController.DeleteVillaTownhouse()
}

// AddImagesVilla @Title Upload image
// @Description Upload new image of villa/townhouse
// @Success 200
// @router /villa/:images/:id [post]
func (v *VillaController) AddImagesVilla() {
	v.VillaTownhouseController.AddImagesVillaTownhouse()
}

// RemoveImagesVilla @Title Upload image
// @Description Remove image of villa/townhouse
// @Success 200
// @router /villa/:images/delete/:id [post]
func (v *VillaController) RemoveImagesVilla() {
	v.VillaTownhouseController.RemoveImagesVillaTownhouse()
}
