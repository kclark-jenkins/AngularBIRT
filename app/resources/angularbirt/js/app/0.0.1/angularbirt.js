$(document).ready(function() {
    dialogOpen   = $('#dialogOpen').dialog({autoOpen: false, zIndex: 10000});
    dialogSave   = $('#dialogSave').dialog({autoOpen: false, zIndex: 10000});
    dialogHelp   = $('#dialogHelp').dialog({autoOpen: false, zIndex: 10000});
    savedFilters = $('#dialogSavedFilters').dialog({autoOpen: false, zIndex: 10000, maxHeight: 450, minHeight: 450});
    savedFiltersGroup = $('#savedFiltersOutput').accordion();

    var footerPosition = $('.footer').position();

    $('#reportViewer').width($(document).width()-200);

    $('#accordionGroups input[type="checkbox"]').click(function(e) {
        e.stopPropagation();
    });

    window.moveForwardOne = function() {
        var next = myViewer.getCurrentPageNum() + 1;
        if(next <= myViewer.getTotalPageCount()) {
            $('#pageN').html(next);
            myViewer.gotoPage(next);
        }
    }

    window.moveBackwardOne = function() {
        var prev = myViewer.getCurrentPageNum() - 1;
        if(prev > 0) {
            myViewer.gotoPage(prev);
            $('#pageN').html(prev);
        }
    }

    window.moveForwardAll = function() {
        myViewer.gotoPage(myViewer.getTotalPageCount());
    }

    window.moveBackwardAll = function() {
        myViewer.gotoPage(1);
    }

    window.runReport = function() {
        console.log($('.birtParameter'));
        var t = $('.birtParameter');
        var paramMap = {};
        for(i=0; i<t.length;i++) {
            paramMap [t[i].name] = t[i].value;
        }

        executeReport(paramMap);
    }

    $('button').click(function() {
        var elementID = $(this).attr('id');

        if(elementID = "execute") {
        }else if(elementID == 'cancelDialogOpen') {
            dialogOpen.dialog('close');
        }else if(elementID == 'cancelParameters') {
            $('.parametersPane').fadeToggle( "slow", "linear" );
        }else if(elementID == 'filterFilter'){
            var filterTheseColumns = {
                'mytable': {
                    'CONTACTLASTNAME': {
                        'condition': actuate.data.Filter.EQ,
                        'value': 'Young'
                    }
                }
            };

            filterColumns(viewer1.getCurrentPageContent(), filterTheseColumns);
        }else if(elementID == 'filterHide'){
            var hideTheseColumns = {
                'mytable': {
                    'columns':['CUSTOMERNUMBER','STATE']
                }
            };

            hideColumns(viewer1.getCurrentPageContent(), myViewer);
        }
    });

    window.getOpenItems = function() {
        var resultDef = "Name|FileType|Version|VersionName|Description";
        getItems(resultDef, "explorerpane");
        //dialogOpen.dialog('open');
    }

    window.openFilters = function() {
        savedFilters.dialog('open');
    }


    window.openSaveFilterDialog = function() {
        $('#saveInput').val('');
        var resultDef = "Name|FileType|Version|VersionName|Description";
        dialogSave.dialog('open');
        getItems(resultDef, "explorerpane2")
        myViewer.saveReportDesign('myNewDesign.rptdesign', function(){console.log('done saving');     // LIVE
            //myViewer.saveReportDocument('myNewDesign.rptdesign', function(){console.log('done saving'); // CACHED
        })
    }

    function openHelpDialog() {
        dialogHelp.dialog('open');
    }

    $(window).on('resize', function() {
        var footerPosition = $('.footer').position();

        myViewer.setHeight($(window).height() - 30);
        myViewer.setWidth($(document).width()-200);
        myViewer.submit();
    });

    function openDesign() {
        buildParams();
        executeReport();
        dialogOpen.dialog('close');
        console.log(reportDesign);
    }

    function getItems(resultDef, pane) {
        console.log('getting items');
        var explorer = new actuate.ReportExplorer(pane);
        explorer.registerEventHandler(
            actuate.reportexplorer.EventConstants.ON_SELECTION_CHANGED,
            function(selectedItem, pathName, pane) {
                console.log(pathName);
                reportDesign = pathName;
                $('#saveInput').val(pathName);

            });
        explorer.setFolderName("/");
        explorer.setResultDef( resultDef.split("|") );
        var test = explorer.submit();
        console.log(test);
    }

    $('#parametersDropDown').click(function() {if($('.parametersPane').is(":visible")) {$('.parametersPane').fadeToggle( "slow", "linear" );}else{buildParams();}});

    $('#filterGroupsDropDown').click(function() {
        $('.parametersPane').fadeToggle( "slow", "linear" );
    });


    function allPages() {
        return "1-"+viewer1.getTotalPageCount();
    }

    function buildParams() {
        console.log('buildParams() for ' + reportDesign);
        params  = new actuate.Parameter("params");
        params.setReportName(reportDesign);
        params.submit(function() {downloadParams(params);});
    }

    function downloadParams(paramsFromViewer) {
        try {

            var allParameters = new Array();

            console.log('downloadParams()');
            console.log(paramsFromViewer);
            for(i=0; i<paramsFromViewer._._paramImpl._paramDefs.length; i++) {
                var currentParameter = {};
                currentParameter = {
                    'cascadingParentName': paramsFromViewer._._paramImpl._paramDefs[i]._._cascadingParentName,
                    'columnType': paramsFromViewer._._paramImpl._paramDefs[i]._._columnType,
                    'currentValue': paramsFromViewer._._paramImpl._paramDefs[i]._._currentValue,
                    'dataType': paramsFromViewer._._paramImpl._paramDefs[i]._._dataType,
                    'defaultValue': paramsFromViewer._._paramImpl._paramDefs[i]._._defaultValue,
                    'displayName': paramsFromViewer._._paramImpl._paramDefs[i]._._displayName,
                    'helpText': paramsFromViewer._._paramImpl._paramDefs[i]._._helpText,
                    'isAdHoc': paramsFromViewer._._paramImpl._paramDefs[i]._._isAdHoc,
                    'isDynamicSelectionList': paramsFromViewer._._paramImpl._paramDefs[i]._._isDynamicSelectionList,
                    'isHidden': paramsFromViewer._._paramImpl._paramDefs[i]._._isHidden,
                    'isPassword': paramsFromViewer._._paramImpl._paramDefs[i]._._isPassword,
                    'isRequired': paramsFromViewer._._paramImpl._paramDefs[i]._._isRequired,
                    'name': paramsFromViewer._._paramImpl._paramDefs[i]._._name
                };
                allParameters.push(currentParameter);
            }

            var renderedParameters = new Array();
            for(i=0; i<allParameters.length; i++) {
                var currentInput = buildInput(allParameters[i].columnType,allParameters[i].name, allParameters[i].defaultValue);
                console.log(currentInput);
                var currentParameters = '<td>'+allParameters[i].displayName+'</td><td>'+currentInput+'</td>';
                renderedParameters.push(currentParameters);

            }

            var parameterTable = '<table class="pTable"><tr>';

            for(i=0; i<renderedParameters.length; i++) {
                parameterTable += renderedParameters[i] + '</tr>'
            }

            parameterTable += '</table>';
            $('#renderedParameters').html(parameterTable);
            $('.parametersPane').fadeToggle( "slow", "linear" );
        }catch(err){
            console.log(err);
        }
    }

    function buildInput(inputType, inputName, defaultValue) {
        console.log('buildInput');
        if(inputType == 'String') {
            console.log('<input type="input" class="birtParameter" name="'+inputName+'" value="'+defaultValue+'">');
            return '<input type="text" class="birtParameter" name="'+inputName+'" value="'+defaultValue+'">';
        }
    }

    function executeReport(paramMap) {

        viewer1 = new actuate.Viewer('reportViewer');
        viewer1.setReportDesign(reportDesign);

        var parameterValues = [];
        for (var key in paramMap) {
            var param = new actuate.viewer.impl.ParameterValue();
            param.setName(key);
            if (paramMap[key] != null) {
                param.setValue(paramMap[key]);
            } else {
                param.setValueIsNull(true);
            }
            parameterValues.push(param);
        }
        viewer1.setParameterValues(parameterValues);
        var options = new actuate.viewer.UIOptions();
        options.enableToolBar(false);
        viewer1.setUIOptions(options);
        console.log($(document).height());
        viewer1.setHeight($(document).height()-130);
        viewer1.setWidth($(document).width()-200);
        viewer1.submit(function() {
            myViewer = viewer1;
            $('#pageN').html(viewer1.getCurrentPageNum());
            $('#pageM').html(viewer1.getTotalPageCount());
            $('#pageOf').html("of");
            myViewer.enableIV();
            //filterReport(viewer1.getCurrentPageContent());
            var myTable = viewer1.getCurrentPageContent();
            getColumnNames();

            if(reportDesign == '/Home/administrator/Medical Report.rptdesign;1') {
                filterColumnGroup();
                hideColumnGroup();
                updatePageNumbers();
            }
        });

        $('#reportName').html(reportDesign.replace(/^.*[\\\/]/, ''));
        getColumnNames();
        dialogOpen.dialog('close');

    }

    function hideColumnGroup() {
        var hideTheseColumns = {
            'mytable': {
                'columns':['CUSTOMERNUMBER','STATE']
            }
        };

        hideColumns(viewer1.getCurrentPageContent(), myViewer);
    }

    function filterColumnGroup() {
        var filterTheseColumns = {
            'mytable': {
                'CONTACTLASTNAME': {
                    'condition': actuate.data.Filter.EQ,
                    'value': 'Young'
                }
            }
        };

        filterColumns(viewer1.getCurrentPageContent(), filterTheseColumns);
    }

    function updatePageNumbers() {
        $('#pageN').html(myViewer.getCurrentPageNum());
        $('#pageM').html(myViewer.getTotalPageCount());
        $('#pageOf').html("of");
    }

    function hideColumns(pagecontent, tables) {
        var tableCount = Object.keys(tables).length;

        for(i=0; i<tableCount; i++) {
            var currentTableName = Object.keys(tables)[i];
            var currentTableObject = pagecontent.getTableByBookmark(currentTableName);

            for(j=0; j<tables[currentTableName].columns.length; j++) {
                console.log(tables[currentTableName].columns[j]);
                currentTableObject.hideColumn(tables[currentTableName].columns[j]);
            }

            currentTableObject.submit();
        }
    }

    function filterColumns(pagecontent, tables) {
        var tableArray = new Array();
        var filtersArray = new Array();

        for(i=0; i<Object.keys(tables).length; i++) {
            var currentTableName  = Object.keys(tables)[i];
            var currentTableObject = pagecontent.getTableByBookmark(currentTableName);
            var filters = new Array();
            console.log('test');

            for(j=0; j<Object.keys(tables[currentTableName]).length; j++) {
                var currentColumnName1 = tables[currentTableName][Object.keys(tables[currentTableName])[j]];
                console.log('$$$$');
                filterOn = Object.keys(tables[currentTableName])[j];
                condition = currentColumnName1.condition;
                value     = currentColumnName1.value;

                var currentFilter = new actuate.data.Filter(filterOn, actuate.data.Filter.EQ, value);

                filters.push(currentFilter);
            }
            currentTableObject.setFilters(filters);
            tableArray.push(currentTableObject);
        }

        for(i=0; i<tableArray.length; i++) {
            tableArray[0].submit(function() {console.log('done filtering');updatePageNumbers();});
        }
    }

    function htmlbodyHeightUpdate(){
        var height3 = $( window ).height()
        var height1 = $('.nav').height()+50
        height2 = $('.main').height()
        if(height2 > height3){
            $('html').height(Math.max(height1,height3,height2)+10);
            $('body').height(Math.max(height1,height3,height2)+10);
        }
        else
        {
            $('html').height(Math.max(height1,height3,height2));
            $('body').height(Math.max(height1,height3,height2));
        }

    }

    htmlbodyHeightUpdate()
    $( window ).resize(function() {
        htmlbodyHeightUpdate()
    });
    $( window ).scroll(function() {
        height2 = $('.main').height()
        htmlbodyHeightUpdate()
    });
});