package controllers

import (
	services "trebooking/services/google"

	"github.com/beego/beego/v2/server/web"
)

type GoogleController struct {
	web.Controller
}


// GetGooglePage @Title Get
// @Description login with google (reply)
// @Success 200
// @router /login/google [get]
func (g *GoogleController) GoogleLogin() {
	services.HandleGoogleLogin(g.Ctx.ResponseWriter, g.Ctx.Request)
}

// GoogleCallBack @Title Get
// @Description get call back (reply)
// @Success 200
// @router /login/google/callback [get]
func (g *GoogleController) GoogleCallback() {
	services.CallBackFromGoogle(g.Ctx.ResponseWriter, g.Ctx.Request)
}