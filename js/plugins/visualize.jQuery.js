/*
 * --------------------------------------------------------------------
 * jQuery inputToButton plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 */
(function($) {
    $.fn.visualize = function(options, container) {
        return $(this).each(function() {
            //configuration
            var o = $.extend({
                type: 'bar', //also available: area, pie, line
                width: $(this).width(), //height of canvas - defaults to table height
                height: $(this).height(), //height of canvas - defaults to table height
                appendKey: true, //color key is added to chart
                rowFilter: '*',
                colFilter: '*',
                colors: ['#be1e2d', '#666699', '#92d5ea', '#ee8310', '#8d10ee', '#5a3b16', '#26a4ed', '#f45a90', '#e9e744'],
                textColors: [], //corresponds with colors array. null/undefined items will fall back to CSS
                parseDirection: 'x', //which direction to parse the table data
                pieMargin: 20, //pie charts only - spacing around pie
                pieLabelsAsPercent: true,
                pieLabelPos: 'inside',
                lineWeight: 4, //for line and area - stroke weight
                barGroupMargin: 10,
                barMargin: 1, //space around bars in bar chart (added to both sides of bar)
                yLabelInterval: 30 //distance between y labels
            }, options);

            //reset width, height to numbers
            o.width = parseFloat(o.width);
            o.height = parseFloat(o.height);


            var self = $(this);

            //function to scrape data from html table
            function scrapeTable() {
                var colors = o.colors;
                var textColors = o.textColors;
                var tableData = {
                    dataGroups: function() {
                        var dataGroups = [];
                        if (o.parseDirection == 'x') {
                            self.find('tr:gt(0)').filter(o.rowFilter).each(function(i) {
                                dataGroups[i] = {};
                                dataGroups[i].clase = $(this).find('th').attr("class");
                                dataGroups[i].points = [];
                                dataGroups[i].color = colors[i];
                                if (textColors[i]) {
                                    dataGroups[i].textColor = textColors[i];
                                }
                                $(this).find('td').filter(o.colFilter).each(function() {
                                    dataGroups[i].points.push(parseFloat($(this).text()));
                                });
                            });
                        }
                        return dataGroups;
                    },
                    allData: function() {
                        var allData = [];
                        $(this.dataGroups()).each(function() {
                            allData.push(this.points);
                        });
                        return allData;
                    },
                    dataSum: function() {
                        var dataSum = 0;
                        var allData = this.allData().join(',').split(',');
                        $(allData).each(function() {
                            dataSum += parseFloat(this);
                        });
                        return dataSum
                    },
                    topValue: function() {
                        var topValue = 0;
                        var allData = this.allData().join(',').split(',');
                        $(allData).each(function() {
                            if (parseFloat(this, 10) > topValue)
                                topValue = parseFloat(this);
                        });
                        return 100;
                    },
                    bottomValue: function() {
                        var bottomValue = 0;
                        var allData = this.allData().join(',').split(',');
                        $(allData).each(function() {
                            if (this < bottomValue)
                                bottomValue = parseFloat(this);
                        });
                        return bottomValue;
                    },
                    memberTotals: function() {
                        var memberTotals = [];
                        var dataGroups = this.dataGroups();
                        $(dataGroups).each(function(l) {
                            var count = 0;
                            $(dataGroups[l].points).each(function(m) {
                                count += dataGroups[l].points[m];
                            });
                            memberTotals.push(count);
                        });
                        return memberTotals;
                    },
                    yTotals: function() {
                        var yTotals = [];
                        var dataGroups = this.dataGroups();
                        var loopLength = this.xLabels().length;
                        for (var i = 0; i < loopLength; i++) {
                            yTotals[i] = [];
                            var thisTotal = 0;
                            $(dataGroups).each(function(l) {
                                yTotals[i].push(this.points[i]);
                            });
                            yTotals[i].join(',').split(',');
                            $(yTotals[i]).each(function() {
                                thisTotal += parseFloat(this);
                            });
                            yTotals[i] = thisTotal;

                        }
                        return yTotals;
                    },
                    topYtotal: function() {
                        var topYtotal = 0;
                        var yTotals = this.yTotals().join(',').split(',');
                        $(yTotals).each(function() {
                            if (parseFloat(this, 10) > topYtotal)
                                topYtotal = parseFloat(this);
                        });
                        return topYtotal;
                    },
                    totalYRange: function() {
                        return this.topValue() - this.bottomValue();
                    },
                    xLabels: function() {
                        var xLabels = [];
                        if (o.parseDirection == 'x') {
                            self.find('tr:eq(0) th').filter(o.colFilter).each(function() {
                                xLabels.push($(this).html());
                            });
                        }
                        return xLabels;
                    },
                    yLabels: function() {
                        var yLabels = [];
                        yLabels.push(bottomValue);
                        var numLabels = Math.round(o.height / o.yLabelInterval);
                        var loopInterval = Math.ceil(totalYRange / numLabels) || 1;
                        //var loopInterval = Math.ceil(100 / numLabels) || 1;
                        while (yLabels[yLabels.length - 1] < topValue - loopInterval) {
                            yLabels.push(yLabels[yLabels.length - 1] + loopInterval);
                        }
                        yLabels.push(100);
                        return yLabels;
                    }
                };

                return tableData;
            }
            ;

            //function to create a chart
            var createChart = {
                line: function(area) {

                    if (area) {
                        canvasContain.addClass('visualize-area');
                    }
                    else {
                        canvasContain.addClass('visualize-line');
                    }

                    //write X labels
                    var xInterval = canvas.width() / (xLabels.length - 1);
                    var xlabelsUL = $('<ul class="visualize-labels-x"></ul>').width(canvas.width()).height(canvas.height()).insertBefore(canvas);
                    $.each(xLabels, function(i) {
                        var thisLi = $('<li><span>' + this + '</span></li>').prepend('<span class="line" />').css('left', xInterval * i).appendTo(xlabelsUL);
                        var label = thisLi.find('span:not(.line)');
                        var leftOffset = label.width() / -2;
                        if (i == 0) {
                            leftOffset = 0;
                        }
                        else if (i == xLabels.length - 1) {
                            leftOffset = -label.width();
                        }
                        label.css('margin-left', leftOffset).addClass('label');
                    });

                    //write Y labels                    
                    var liBottom = canvas.height() / (yLabels.length - 1);
                    var ylabelsUL = $('<ul class="visualize-labels-y"></ul>').width(canvas.width()).height(canvas.height()).insertBefore(canvas);

                    $.each(yLabels, function(i) {
                        var thisLi = $('<li><span>' + this + '</span></li>').prepend('<span class="line"  />').css('bottom', liBottom * i).prependTo(ylabelsUL);
                        var label = thisLi.find('span:not(.line)');
                        var topOffset = label.height() / -2;
                        if (i == 0) {
                            topOffset = -label.height();
                        }
                        else if (i == yLabels.length - 1) {
                            topOffset = 0;
                        }
                        label
                                .css('margin-top', topOffset)
                                .addClass('label');
                    });

                    //start from the bottom left
                    ctx.translate(0, zeroLoc);

                    //iterate and draw
                    $.each(dataGroups, function(i) {
                        if (this.clase != "hidden") {
                            drawLine(i);
                        }
                    });
                }
            };

            function drawLine(i) {

                var linea = dataGroups[i];

                var xInterval = canvas.width() / (xLabels.length - 1);
                var yScale = canvas.height() / totalYRange;

                ctx.beginPath();
                ctx.lineWidth = o.lineWeight;
                ctx.lineJoin = 'round';
                var points = linea.points;
                var integer = 0;
                ctx.moveTo(0, -(points[0] * yScale));
                $.each(points, function() {
                    ctx.lineTo(integer, -(this * yScale));
                    integer += xInterval;
                });
                ctx.strokeStyle = linea.color;
                ctx.stroke();
                ctx.closePath();
            }

            //create new canvas, set w&h attrs (not inline styles)
            var canvasNode = document.createElement("canvas");
            canvasNode.setAttribute('height', o.height);
            canvasNode.setAttribute('width', o.width);
            var canvas = $(canvasNode);

            //create canvas wrapper div, set inline w&h, append
            var canvasContain = (container || $('<div class="visualize" role="img"/>')).height(o.height).width(o.width);

            //scrape table (this should be cleaned up into an obj)
            var tableData = scrapeTable();
            var dataGroups = tableData.dataGroups();
            var allData = tableData.allData();
            var dataSum = tableData.dataSum();
            var topValue = tableData.topValue();
            var bottomValue = 0;
            var memberTotals = tableData.memberTotals();
            var totalYRange = 100;
            var zeroLoc = o.height * (topValue / totalYRange);
            var xLabels = tableData.xLabels();
            var yLabels = tableData.yLabels();

            //key container
            if (o.appendKey) {
                var infoContain = $('<div class="visualize-info"></div>').appendTo(canvasContain);
            }

            //append key
            if (o.appendKey) {
                var newKey = $('<ul class="visualize-key"></ul>');
                var selector;
                if (o.parseDirection == 'x') {
                    selector = self.find('tr:gt(0) th').filter(o.rowFilter);
                }

                selector.each(function(i) {
                    if (!$(this).closest("th").hasClass("hidden")) {
                        $('<li><span class="visualize-key-color" style="background: ' + dataGroups[i].color + '"></span><span class="visualize-key-label">' + $(this).text() + '</span></li>')
                                .appendTo(newKey);
                    }
                });
                newKey.appendTo(infoContain);
            }
            canvasContain.append(infoContain).append(canvas);

            //append new canvas to page

            if (!container) {
                canvasContain.insertAfter(this);
            }
            if (typeof(G_vmlCanvasManager) != 'undefined') {
                G_vmlCanvasManager.init();
                G_vmlCanvasManager.initElement(canvas[0]);
            }

            //set up the drawing board	
            var ctx = canvas[0].getContext('2d');

            //create chart
            createChart[o.type]();

            var info = $(canvasContain).find(".visualize-info");
            $(info).css("top", "-" + ($(info).height() + 10) + "px");
            $(info).css("width", $(canvasContain).find("canvas").width() + "px");

            if (!container) {
                //add event for updating
                canvasContain.bind('visualizeRefresh', function() {
                    self.visualize(o, $(this).empty());
                });
            }
        }).next(); //returns canvas(es)
    };
})(jQuery);

