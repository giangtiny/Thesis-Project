package fileio

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"io"
	"mime/multipart"
	"os"
	"strings"
	"time"
)

var path = "./static/images/"

//var path = "D:/TreBayBooking/static/images/"

func UploadImages(fileUploads *[]*multipart.FileHeader) error {
	os.MkdirAll(path, os.ModePerm)
	for _, fileUpload := range *fileUploads {
		inFile, err := fileUpload.Open()
		if err != nil {
			return err
		}
		fileName := primitive.NewObjectIDFromTimestamp(time.Now()).Hex() + "-" + strings.ReplaceAll(fileUpload.Filename, " ", "-")
		//f, err := os.Create(fmt.Sprintf("D:/TreBayBooking/static/images/%s", fileName))
		f, err := os.Create(fmt.Sprintf("./static/images/%s", fileName))
		if err != nil {
			return err
		}
		fileUpload.Filename = fileName
		io.Copy(f, inFile)
		defer f.Close()
	}
	return nil
}

func RemoveImages(imageNames []string) error {
	for _, imageName := range imageNames {
		if err := os.Remove(path + imageName); err != nil {
			return err
		}
	}
	return nil
}

func RemoveImage(imageName string) error {
	if err := os.Remove(path + imageName); err != nil {
		return err
	}
	return nil
}
