# Tabnabbing Chrome Extension

### Author: Zihan Qu

## How to Install

- Open the chrome client application
- Turn on the developer mode
- Click "More" > Extension > Manage Extension > Load unpacked Extension

## How it work:
The extension can traverse the tab it screenshots, and if the mismatched part is higher than 20%, thus it will raise the alert and highlight the difference. While the icon remain green, it means that the content difference is less than 20%, it indicated that there is less change to have tabnabbing, if the icon turns to red, it means, the web page has a higher possibility to be tabnabbed. The function will be triggered after a user open the page for a while but leave the page to other pages. 

- This is a normal web page:
  
![Normal Webpage](/screenshots/normal.png "Normal")


- This is a highlighted web page

![Tabnabbing Webpage](/screenshots/tabnab.png "Tabnabbing")
