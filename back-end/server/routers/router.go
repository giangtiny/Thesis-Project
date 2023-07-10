// Package routers @APIVersion 1.0.0
// @Title beego Test API
// @Description beego has a very cool tools to autogenerate documents for your API
// @Contact astaxie@gmail.com
// @TermsOfServiceUrl http://beego.me/
// @License Apache 2.0
// @LicenseUrl http://www.apache.org/licenses/LICENSE-2.0.html
package routers

import (
	"trebooking/controllers"

	beego "github.com/beego/beego/v2/server/web"
)

func init() {
	// beego.Router("/comment/add", &controllers.CommentController{}, "*:Add")
	// beego.Router("/comment/all/detail", &controllers.CommentController{}, "*:GetAllDetailComment")
	// beego.Router("/amenity/add", &controllers.AmenityController{}, "*:Add")
	ns := beego.NewNamespace("/api/v1",
		beego.NSInclude(
			&controllers.UserController{},
			&controllers.HotelController{},
			&controllers.VillaController{},
			&controllers.TownhouseController{},
			&controllers.VillaOrderController{},
			&controllers.TownhouseOrderController{},
			&controllers.RoomController{},
			&controllers.RoomOrderController{},
			&controllers.GoogleController{},
			&controllers.WeekendController{},
			&controllers.HolidayController{},
			&controllers.NewsController{},
			&controllers.NewsContentController{},
			&controllers.AmenityController{},
			&controllers.CommentController{},
		),
	)
	beego.AddNamespace(ns)
}
