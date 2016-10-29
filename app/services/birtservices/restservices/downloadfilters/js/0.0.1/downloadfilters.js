var app = angular.module('AngularBIRT');

app.service('downloadfilters', function($http, $q) {
    var downloadFilters = function(authid, id) {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: 'http://ihub.demoimage.com:8000/api/v2/files/'+id+'/download?base64=false',
            headers: {
                'AuthToken': authid
            }
        }).then(function(response) {
            deferred.resolve(response.data);
        });

        return deferred.promise;
    }

    this.doDownloadFilters = function(authid, fileid) {
        var deferred = $q.defer();

        downloadFilters(authid, fileid).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.resolve(data);
        });

        return deferred.promise;
    }
});