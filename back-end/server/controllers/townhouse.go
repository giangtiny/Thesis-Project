package controllers

import "trebooking/utils"

type TownhouseController struct {
	VillaTownhouseController
}

// GetAllTownHouse
// Get @Title Get all townhouse
// @Description Get all townhouse
// @Success 200
// @router /townhouse/all [get]
func (t *TownhouseController) GetAllTownHouse() {
	t.VillaTownhouseController.GetAll(utils.TOWN_HOUSE)
}

// GetAllSpeciaTownHouse
// Get @Title Get all townhouse
// @Description Get all townhouse
// @Success 200
// @router /townhouse/all/special [get]
func (t *TownhouseController) GetAllSpeciaTownHouse() {
	t.VillaTownhouseController.GetAllSpecialVillaTownhouse(utils.TOWN_HOUSE)
}

// CreateTownhouse
// Post @Title Create Townhouse
// @Description Create Townhouse
// @Success 200
// @router /townhouse [post]
func (t *TownhouseController) CreateTownhouse() {
	t.VillaTownhouseController.CreateVillaTownhouse()
}

// GetTownhouse
// Get @Title Get townhouse
// @Description Get townhouse
// @Success 200
// @Param id path string true "Id of townhouse"
// @router /townhouse/:id [get]
func (t *TownhouseController) GetTownhouse() {
	t.VillaTownhouseController.GetVillaTownhouse()
}

// GetPagedTownhouse
// Get @Title Get Paged townhouse
// @Description Get Paged townhouse
// @Success 200
// @Param offset query int true "offset"
// @Param maxperpage query int true "max townhouse per page"
// @router /townhouse [get]
func (t *TownhouseController) GetPagedTownhouse() {
	t.VillaTownhouseController.GetPagedVillaTownhouse(utils.TOWN_HOUSE)
}

// UpdateTownhouse
// Put @Title Update Information townhouse
// @Description Update information townhouse
// @Success 200
// @Param id query int true "offset"
// @Param townhouse body models.VillaTownhouse true "information"
// @router /townhouse/:id [put]
func (t *TownhouseController) UpdateTownhouse() {
	t.VillaTownhouseController.UpdateVillaTownhouse()
}

// CalculateTownhouseFee
// Post @Title Calculate townhouse fee
// @Description Calculate townhouse fee
// @Success 200
// @router /townhouse/calculate [post]
func (t *TownhouseController) CalculateTownhouseFee() {
	t.VillaTownhouseController.CalculateVillaTownhouseFee()
}

// DeleteTownhouse @Title Delete villa
// @Description Delete villa by ID
// @Param id path string true "Id of townhouse"
// @Success 200
// @router /townhouse/:id [delete]
func (t *TownhouseController) DeleteTownhouse() {
	t.VillaTownhouseController.DeleteVillaTownhouse()
}

// AddImagesTownhouse @Title Upload image
// @Description Upload new image of villa/townhouse
// @Success 200
// @router /townhouse/:images/:id [post]
func (v *VillaController) AddImagesTownhouse() {
	v.VillaTownhouseController.AddImagesVillaTownhouse()
}

// RemoveImagesTownhouse @Title Upload image
// @Description Remove image of villa/townhouse
// @Success 200
// @router /townhouse/:images/delete/:id [post]
func (v *VillaController) RemoveImagesTownhouse() {
	v.VillaTownhouseController.RemoveImagesVillaTownhouse()
}
