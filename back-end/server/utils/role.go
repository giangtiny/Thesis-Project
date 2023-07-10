package utils

const (
	SuperAdmin        string = "ROLE_SUPER_ADMIN"
	Admin             string = "ROLE_ADMIN"
	Collaborator      string = "ROLE_COLLABORATOR"
	StaffCollaborator string = "ROLE_STAFF_COLLABORATOR"
	Staff             string = "ROLE_STAFF"
	User              string = "ROLE_USER"
)

var Roles = []string{"ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_COLLABORATOR", "ROLE_STAFF_COLLABORATOR", "ROLE_STAFF", "ROLE_USER"}

var RolesAdmin = []string{"ROLE_STAFF_COLLABORATOR", "ROLE_STAFF", "ROLE_USER"}
var RolesSuperAdmin = []string{"ROLE_ADMIN", "ROLE_COLLABORATOR", "ROLE_STAFF_COLLABORATOR", "ROLE_STAFF", "ROLE_USER"}
