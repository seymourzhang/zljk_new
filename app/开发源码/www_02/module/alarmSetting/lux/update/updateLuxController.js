angular.module('myApp.updateLux', 
        ['ionic','ngCordova','ngTouch',
         'ui.grid','ui.grid.pinning','ui.grid.edit','ui.grid.cellNav', 'ui.grid.validate', 'ui.grid.grouping', 'ui.grid.selection','ui.grid.resizeColumns','ui.grid.autoResize'
         ])
//修改光照报警数据
.controller("updateLuxCtrl",function($scope, $state, $http, $stateParams, AppData) {
    Sparraw.intoMyController($scope, $state);
    $scope.sparraw_user_temp = JSON.parse(JSON.stringify(sparraw_user));
    
    $scope.setData = function(){
        $scope.updateLuxData = {
            "farmId"           :  ""  ,
            "tableData"        :  {}  
        };
        $scope.updateLuxData.tableData = JSON.parse($stateParams.item);
        for (var i = 0; i < $scope.sparraw_user_temp.farmList.length; i++) {
            if ($scope.sparraw_user_temp.farmList[i].farmId == $scope.sparraw_user_temp.farminfo.id) {
                $scope.updateLuxData.farmId = $scope.sparraw_user_temp.farmList[i].farmId;
            }
        }
        $scope.updateLuxData.tableData.start_time = JSON.parse($stateParams.item).start_time + ":00";
        $scope.updateLuxData.tableData.end_time = JSON.parse($stateParams.item).end_time + ":00";
    };

    $scope.updateLuxSave = function(){
        //添加权限
        if ($scope.sparraw_user_temp.Authority.AlarmSet == "all") {

        }else{
            return app_alert("该用户无此操作权限。");
        };
        var params = {
            "farmId"           :  $scope.updateLuxData.farmId                        ,
            "houseId"          :  $stateParams.houseId                               ,
            "alarm_type"       :  "2"                                                ,
            "day_age"          :  $scope.updateLuxData.tableData.day_age             ,
            "high_lux"         :  $scope.updateLuxData.tableData.high_lux            ,
            "low_lux"          :  $scope.updateLuxData.tableData.low_lux             ,
            "set_lux"          :  $scope.updateLuxData.tableData.set_lux             ,
            "start_time"       :  $scope.updateLuxData.tableData.start_time          ,
            "end_time"         :  $scope.updateLuxData.tableData.end_time            ,
            "uid_num"          :  $scope.updateLuxData.tableData.uid_num
        };
        console.log("保存的params:");
        console.log(params);
        if (!$scope.inspectionParams(params)) {return;} //检验传输的数据
        Sparraw.ajaxPost('alarmSettingMobile/itemUpdate', params, function(data){
            if (data.ResponseDetail.Result == "Success") {
                Sparraw.myNotice("修改成功");
                $state.go("alarmSetting");
            }else{
                Sparraw.myNotice(data.ResponseDetail.Error);
            };
        },null,60000);
    };

    $scope.inspectionParams = function(params){

        var TempStartTime = parseInt(params.start_time);
        var TempEndTime = parseInt(params.end_time);
        if (TempStartTime > TempEndTime) {
            app_alert("开始时间不能大于结束时间,请重新选择。");
            return false;
        }

        if (!params.farmId ||!params.houseId ||!params.alarm_type ||!params.uid_num) {
            app_alert("数据有误,请重新登陆。");
            return false;
        }

        if (isNaN(params.day_age)) {
            app_alert("请输入正确的日龄。");
            return false;
        }else if (isNaN(params.high_lux)) {
            app_alert("请输入正确的光照上限。");
            return false;
        }else if (isNaN(params.low_lux)) {
            app_alert("请输入正确的光照下限。");
            return false;
        }else if (isNaN(params.set_lux)) {
            app_alert("请输入正确的光照参照。");
            return false;
        }

        if (!params.day_age) {
            app_alert("缺少日龄,请重新输入。");
            return false;
        }else if (!params.high_lux) {
            app_alert("缺少光照上限,请重新输入。");
            return false;
        }else if (!params.low_lux) {
            app_alert("缺少光照下限,请重新输入。");
            return false;
        }else if (!params.set_lux) {
            app_alert("缺少光照参照,请重新输入。");
            return false;
        }else if (!params.start_time) {
            app_alert("缺少开始时间,请重新输入。");
            return false;
        }else if (!params.end_time) {
            app_alert("缺少结束时间,请重新输入。");
            return false;
        }

        return true;
    };
    
    $scope.setData();
})
