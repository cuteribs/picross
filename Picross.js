var board =
{
	name: "Eric's Picross Game",
	version: " v0.27",
	rawData: "",
	schema: "",
	type: "",
	container: null,
	gameTitle: null,
	timer: null,
	colHeader: null,
	rowHeader: null,
	squareBoard: null,
	timerId: null,
	scoreBoard: null,
	seconds: 0,
	rowCount: 0,
	colCount: 0,
	button: 0,
	blockCount: 0,
	revealedCount: 0,
	errorCount: 0,
	over: false,
	
	clear: function()
	{
		board.container = null;
		board.gameTitle = null;
		board.timer = null;
		board.colHeader = null;
		board.rowHeader = null;
		board.squareBoard = null;
		board.scoreBoard = null;
		board.seconds = 0;
		board.rowCount = 0;
		board.colCount = 0;
		board.button = 0;
		board.blockCount = 0;
		board.revealedCount = 0;
		board.errorCount = 0;
		board.over = false;
		
		if(board.timerId != null)
		{
			window.clearInterval(board.timerId);			
			board.timerId = null;
		}
	},
	
	init: function()
	{
		board.clear();
		board.container = document.getElementById("divBoard");
		
		if(board.schema == "")
		{
			board.schema = board.container.innerHTML;
		}
		else
		{
			board.container.innerHTML = board.schema;
		}		
		
		board.gameTitle = document.getElementById("captionTitle");
		board.gameTitle.innerHTML = board.name;
		board.timer = document.getElementById("tdTimer");
		board.scoreBoard = document.getElementById("divScoreBoard");
		board.colHeader = document.getElementById("tableColHeader").tBodies[0];
		board.rowHeader = document.getElementById("tableRowHeader").tBodies[0];
		board.squareBoard = document.getElementById("tableSquare").tBodies[0];			
		var dataArray = new Array();
		var rowData = board.rawData.split("2");
		board.rawData = "";
		
		for(var i = 0; i < rowData.length; i++)
		{
			dataArray[i] = new Array(rowData[i].length);
			
			for(var j = 0; j < rowData[i].length; j++)
			{
				dataArray[i][j] = parseInt(rowData[i].charAt(j));
				
				if(dataArray[i][j] == 1)
				{
					board.blockCount++;
				}
			}
		}
		
		board.rowCount = dataArray.length;
		board.colCount = dataArray[0].length;
		var tr = board.colHeader.appendChild(document.createElement("tr"));
		var td;
		
		for(var i = 0; i < board.colCount; i++)
		{
			td = tr.appendChild(document.createElement("td"));
			td.innerHTML = getColNumbers(dataArray, i);
		}
		
		for(var i = 0; i < board.rowCount; i++)
		{
			tr = board.rowHeader.appendChild(document.createElement("tr"));
			td = tr.appendChild(document.createElement("td"));
			td.innerHTML = getRowNumbers(dataArray, i);
		}
		
		board.squares = new Array(board.rowCount);
		
		for(var i = 0; i < board.rowCount; i++)
		{
			board.squares[i] = new Array(board.colCount);
			tr = board.squareBoard.appendChild(document.createElement("tr"));
			
			for(var j = 0; j < board.colCount; j++)
			{
				td = tr.appendChild(document.createElement("td"));
				board.squares[i][j] = td;
				td.block = false;
				td.revealed = false;
				td.rowIndex = i;
				td.colIndex = j;
				td.position = i % 2 + j % 2;
				td.className = "";
				td.onmousedown = squareOnMouseDown;
				td.onmouseover = squareOnMouseOver;
				td.onmouseout = squareOnMouseOut;
				
				if(dataArray[i][j] == 1)
				{
					td.block = true;
				}
			}
		}
		
		checkEmptyAlignment();
		board.container.style.display = "block";
		
		if(confirm("Use Hits?"))
		{
			var index = Math.floor(board.rowCount * Math.random());
			revealRow(index);
			index = Math.floor(board.colCount * Math.random());
			revealCol(index);
		}
		
		document.getElementById("divBoardSize").innerHTML = board.rowCount + " x " + board.colCount;
		board.timerId = window.setInterval("timerTick()", 1000);
	},
	
	finish: function()
	{
		window.clearInterval(board.timerId);
		board.timerId = null;
		board.over = true;
		
		for(var i = 0; i < board.rowCount; i++)
		{
			for(var j = 0; j < board.colCount; j++)
			{
				if(board.squares[i][j].block)
				{
					board.squares[i][j].className = "block";
				}
				else
				{
					board.squares[i][j].className = "plain";
				}
			}
		}
		
		scoreBoard.show();
	}
}

var scoreBoard =
{
	container: null,
	gameType: null,
	gameTime: null,
	gameError: null,
	
	setPosition: function()
	{
		var x = (document.body.clientWidth - parseInt(scoreBoard.container.style.width)) / 2;
		var y = (document.body.clientHeight - parseInt(scoreBoard.container.style.height)) / 2;
		scoreBoard.container.style.left = x + "px";
		scoreBoard.container.style.top = y + "px";
	},
	
	show: function()
	{
		scoreBoard.container = document.getElementById("divScoreBoard");
		scoreBoard.gameType = document.getElementById("ddGameType");
		scoreBoard.gameTime = document.getElementById("ddGameTime");
		scoreBoard.gameError = document.getElementById("ddGameError");
		scoreBoard.gameType.innerHTML = board.type + " " + board.rowCount + "x" + board.colCount;
		scoreBoard.gameTime.innerHTML = board.timer.innerHTML;		
		scoreBoard.gameError.innerHTML = board.errorCount;
		scoreBoard.setPosition();
		scoreBoard.container.style.display = "block";
		window.onresize = scoreBoard.setPosition;
	},
	
	hide: function()
	{
		scoreBoard.container.style.display = "none";
	}	
}

function getRowNumbers(dataArray, index)
{
	var rowNumbers = "";
	var rowNumber = 0;
	var n;
	
	for(var i = 0; i < dataArray[index].length; i++)
	{
		n = rowNumber;
		
		if(dataArray[index][i] == 1)
		{
			rowNumber++;
		}
		else
		{
			rowNumber = 0;
		}
		
		if(rowNumber == 0 && n > 0)
		{
			rowNumbers += "&nbsp;"
			rowNumbers += n;
		}
		else if(i == dataArray[index].length - 1 && rowNumber > 0)
		{
			rowNumbers += "&nbsp;"
			rowNumbers += rowNumber;
		}
	}
	
	if(rowNumbers == "")
	{
		rowNumbers = "&nbsp;0";
	}
	
	return rowNumbers;
}

function getColNumbers(dataArray, index)
{
	var colNumbers = "";
	var colNumber = 0;
	var n;
	
	for(var i = 0; i < dataArray.length; i++)
	{
		n = colNumber;
		
		if(dataArray[i][index] == 1)
		{
			colNumber++;
		}
		else
		{
			colNumber = 0;
		}
		
		if(colNumber == 0 && n > 0)
		{
			colNumbers += "<br />";
			colNumbers += n;
		}
		else if(i == dataArray.length - 1 && colNumber > 0)
		{
			colNumbers += "<br />";
			colNumbers += colNumber;
		}
	}
	
	if(colNumbers == "")
	{
		colNumbers = "<br />0";
	}
	
	return colNumbers;
}

function checkEmptyAlignment()
{
	var emptyRow = new Array(board.squares.length);
	var emptyCol = new Array(board.squares[0].length);
	
	for(var i = 0; i < board.squares.length; i++)
	{
		for(var j = 0; j < board.squares[i].length; j++)
		{
			if(board.squares[i][j].block)
			{
				emptyRow[i] = false;
				emptyCol[j] = false;
			}			
		}
	}
	
	for(var i = 0; i < emptyRow.length; i++)
	{
		if(emptyRow[i] != false)
		{
			revealRow(i);
		}
	}	
	
	for(var i = 0; i < emptyCol.length; i++)
	{
		if(emptyCol[i] != false)
		{
			revealCol(i);
		}
	}
}

function revealRow(index)
{
	for(var i = 0; i < board.colCount; i++)
	{
		if(!board.squares[index][i].revealed)
		{
			if(board.squares[index][i].block)
			{
				board.squares[index][i].className = "revealed";
				board.squares[index][i].revealed = true;
				board.revealedCount++;
			}
			else
			{
				board.squares[index][i].className = "error";
			}
		}
	}
	
	checkRevealedRow(index);
}

function revealCol(index)
{
	for(var i = 0; i < board.rowCount; i++)
	{
		if(!board.squares[i][index].revealed)
		{
			if(board.squares[i][index].block)
			{
				board.squares[i][index].className = "revealed";
				board.squares[i][index].revealed = true;
				board.revealedCount++;
			}
			else
			{
				board.squares[i][index].className = "error";
			}
		}
	}	
	
	checkRevealedCol(index);
}

function checkRevealedRow(index)
{	
	var revealedCols = 0;
	var blockCols = 0;
	
	for(var i = 0; i < board.colCount; i++)
	{
		if(board.squares[index][i].revealed)
		{
			revealedCols++;
		}		
		
		if(board.squares[index][i].block)
		{
			blockCols++
		}
	}
	
	if(revealedCols == blockCols)
	{
		board.rowHeader.rows[index].cells[0].className = "revealed";
	}
}

function checkRevealedCol(index)
{
	var revealedRows = 0;
	var blockRows = 0;
	
	for(var i = 0; i < board.rowCount; i++)
	{
		if(board.squares[i][index].revealed)
		{
			revealedRows++;
		}
		
		if(board.squares[i][index].block)
		{
			blockRows++
		}
	}
	
	if(revealedRows == blockRows)
	{
		board.colHeader.rows[0].cells[index].className = "revealed";
	}
}

function hitsquare(square)
{
	if(board.over || square.revealed)
	{
		return;
	}
	
	if(board.button == 1)
	{
		if(square.className == "marked")
		{
			square.className = "highlight";
		}
		else if(square.className == "error")
		{
			return;
		}
		else if(square.block)
		{
			board.revealedCount++;
			square.revealed = true;
			square.className = "revealed";
			checkRevealedRow(square.rowIndex);
			checkRevealedCol(square.colIndex);
			
			if(board.revealedCount == board.blockCount)
			{
				board.finish();
				return;
			}
		}
		else
		{
			board.errorCount++;
			square.className = "error";
		}		
	}
	else if(board.button == 2)
	{
		if(square.className == "marked")
		{
			square.className = "highlight";
		}
		else if(square.className == "highlight")
		{
			square.className = "marked";
		}
	}
}

function squareOnMouseDown(e)
{
	var square = getSrcElement(e);
	
	if(isIE)
	{
		board.button = event.button;
		event.returnValue = false;
	}
	else
	{		
		if(e.button == 0)
		{
			board.button = 1;
		}
		else if(e.button == 2)
		{
			board.button = 2;
		}
		
		e.preventDefault();
	}
	
	hitsquare(square);
}

function squareOnMouseOver(e)
{
	if(board.over)
	{
		return;
	}
	
	var square = getSrcElement(e);
	
	for(var i = 0; i < board.rowCount; i++)
	{
		for(var j = 0; j < board.colCount; j++)
		{
			if((i == square.rowIndex || j == square.colIndex) && board.squares[i][j].className == "")
			{
				board.squares[i][j].className = "highlight";
			}
		}
	}
}

function squareOnMouseOut(e)
{
	if(board.over)
	{
		return;
	}
	
	var square = getSrcElement(e);
	
	for(var i = 0; i < board.rowCount; i++)
	{
		for(var j = 0; j < board.colCount; j++)
		{
			if((i == square.rowIndex || j == square.colIndex) && board.squares[i][j].className == "highlight")
			{
				board.squares[i][j].className = "";
			}
		}
	}
}

function getSrcElement(e)
{
	return isIE ? event.srcElement : e.target;
}

function timerTick()
{
	board.seconds += 1
	board.timer.innerHTML = getTime(board.seconds);
}

function getTime(seconds)
{
	var hour = Math.floor(seconds / 3600);
	seconds %= 3600;
	var minute = Math.floor(seconds / 60);
	seconds %= 60;
	var second = seconds;
	var timeString = hour >= 10 ? hour : "0" + hour;
	timeString += ":";
	timeString += minute >= 10 ? minute : "0" + minute;
	timeString += ":";
	timeString += second >= 10 ? second : "0" + second;
	return timeString
}

function loadBoard(rawData)
{
	board.rawData = rawData;
	board.init();
}

