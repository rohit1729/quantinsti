angular.module('myapp', [])
      .controller('InstrumentsController', function($scope, $http, $interval) {
        $scope.title = 'Instruments';
        $scope.instruments = new Array();
        $scope.snackbarContainer = document.querySelector('#snackbar');
        $scope.loadInstruments  = function(action){
          console.log($scope.instruments);  
          if ($scope.instruments){
            url = '/api/instruments?offset='+$scope.instruments.length+'&action='+action;
          }else{
            url = '/api/instruments';
          }
          $http({
            method: 'GET',
            url: url
          }).then(function successCallback(response) {
              $scope.instruments = response.data;
              console.log($scope.snackbarContainer);
              $scope.snackbarContainer.MaterialSnackbar.showSnackbar({
                'message':'Instruments loaded'
              });
          }, function errorCallback(response) {
              console.log(response);
          });
        }

        $scope.addTransaction = function(){
          if($scope.transaction){
            data = {'transaction':$scope.transaction}
            $http({
              method: 'POST',
              url: '/instruments',
              data: data
            }).then(function successCallback(response) {
                $scope.transaction = null;
                console.log(response);
                 $scope.snackbarContainer.MaterialSnackbar.showSnackbar({
                  'message': response.data.message
                });
                 $scope.loadInstruments('refresh');
            }, function errorCallback(response) {
                console.log(response);
            });
          }
        }
        $scope.loadInstruments('load');
        $scope.pinger = $interval(function() {
          $scope.loadInstruments('refresh');
        }, 5000);
    }).controller('InstrumentController', function($scope,$http){
      $scope.snackbarContainer = document.querySelector('#snackbar');
      $scope.loadInstrument = function(instrument_id){
        $http({
            method: 'GET',
            url: '/api/instruments/'+instrument_id
        }).then(function successCallback(response) {
            $scope.response = response.data;
            console.log($scope.response);
            $scope.snackbarContainer.MaterialSnackbar.showSnackbar({
              'message':'Instrument loaded'
            });
        }, function errorCallback(response) {
            $scope.snackbarContainer.MaterialSnackbar.showSnackbar({
              'message':'Instrument loading failed'
            });
        });
      }
      var reg = /[0-9]+$/;
      var instrument_id = reg.exec(window.location.href)[0];
      $scope.loadInstrument(instrument_id);
      $scope.action = function(transaction){
        if (transaction.action == 1){
          return 'buy';
        }else{
          return 'sell';
        }
      }
    });

