angular.module('myApp.addTemp', 
        ['ionic','ngCordova','ngTouch',
         'ui.grid','ui.grid.pinning','ui.grid.edit','ui.grid.cellNav', 'ui.grid.validate', 'ui.grid.grouping', 'ui.grid.selection','ui.grid.resizeColumns','ui.grid.autoResize'
         ])
//添加报警数据
.controller("addTempCtrl",function($scope, $state, $http, $stateParams, AppData) {
	Sparraw.intoMyController($scope, $state);
    $scope.sparraw_user_temp = JSON.parse(JSON.stringify(sparraw_user));
    
    $scope.setData = function(){
    	$scope.addTempData = {
    		"day_age"          :  ""  ,
            "farmId"           :  ""  ,
    		"high_alarm_temp"  :  ""  ,
    		"low_alarm_temp"   :  ""  ,
            "set_temp"         :  ""  
    	};
        for (var i = 0; i < $scope.sparraw_user_temp.farmList.length; i++) {
            if ($scope.sparraw_user_temp.farmList[i].farmId == $scope.sparraw_user_temp.farminfo.id) {
                $scope.addTempData.farmId = $scope.sparraw_user_temp.farmList[i].farmId;
            }
        }
    };

    $scope.addTempSave = function(){
        //添加权限
        if ($scope.sparraw_user_temp.Authority.AlarmSet == "all") {

        }else{
            return app_alert("该用户无此操作权限。");
        };
    	var params = {
         	"farmId"           :  $scope.addTempData.farmId             ,
            "houseId"          :  $stateParams.houseId                  ,
            "alarm_type"       :  "1"                                   ,
            "day_age"          :  $scope.addTempData.day_age            ,
            "high_alarm_temp"  :  $scope.addTempData.high_alarm_temp    ,
            "low_alarm_temp"   :  $scope.addTempData.low_alarm_temp     ,
            "set_temp"         :  $scope.addTempData.set_temp  
		};
		console.log("保存的params:");
        console.log(params);
        if (!$scope.inspectionParams(params)) {return;} //检验传输的数据
		Sparraw.ajaxPost('alarmSettingMobile/itemAdd', params, function(data){
			if (data.ResponseDetail.Result == "Success") {
				Sparraw.myNotice("保存成功");
                $state.go("alarmSetting");
			}else{
				Sparraw.myNotice(data.ResponseDetail.Error);
			};
		},null,60000);
    }

    $scope.inspectionParams = function(params){
        if (!params.farmId ||!params.houseId ||!params.alarm_type) {
            app_alert("数据有误,请重新登陆。");
            return false;
        }

        if (isNaN(params.day_age)) {
            app_alert("请输入正确的日龄");
            return false;
        }else if (isNaN(params.high_alarm_temp)) {
            app_alert("请输入正确的目标温度");
            return false;
        }else if (isNaN(params.low_alarm_temp)) {
            app_alert("请输入正确的高报温度");
            return false;
        }else if (isNaN(params.set_temp)) {
            app_alert("请输入正确的低报温度");
            return false;
        }

        if (!params.day_age) {
            app_alert("缺少日龄,请重新输入。");
            return false;
        }else if (!params.high_alarm_temp) {
            app_alert("缺少目标温度,请重新输入。");
            return false;
        }else if (!params.low_alarm_temp) {
            app_alert("缺少高报温度,请重新输入。");
            return false;
        }else if (!params.set_temp) {
            app_alert("缺少低报温度,请重新输入。");
            return false;
        }

        return true;
    };

    $scope.setData();
})