<!--
var patterns;

function loadXmlDoc(xmlUrl)
{
	var xmlDoc;
	
	if(window.ActiveXObject)
	{
		xmlDoc = new ActiveXObject("Msxml2.DOMDocument");
	}
	else
	{
		xmlDoc = document.implementation.createDocument("", "", null);
	}
	
	xmlDoc.async = false;
	xmlDoc.load(xmlUrl);
	return(xmlDoc);
}

function loadPatterns(select)
{
	var xmlDoc = loadXmlDoc("Patterns.xml");
	
	if(window.ActiveXObject)
	{
		patterns = xmlDoc.selectNodes("Patterns/Pattern");
	}
	else
	{
		var root = xmlDoc.getElementsByTagName("Patterns")[0];
		patterns = root.getElementsByTagName("Pattern");
	}
	
	var patternName;
	
	for(var i = 0; i < patterns.length; i++)
	{
		patternName = patterns[i].getAttribute("Name");
		select.options.add(new Option(patternName, patternName));		
	}
}

function getPattern(patternName)
{
	var pattern;
	
	for(var i = 0; i < patterns.length; i++)
	{
		if(patterns[i].getAttribute("Name") == patternName)
		{
			if(isIE)
			{
				pattern = patterns[i].text;
			}
			else
			{
				pattern = patterns[i].textContent;
			}
			
			break;
		}
	}
	
	return pattern;
}
-->