/*
	MounTable.js

	Developed by Guilherme Augusto Madaleno <guimadaleno@me.com>
	www.guimadaleno.com
	(C) 2014 All rights reserved
	Licensed under GNU GPL
*/

$.fn.mounTable = function (content, options)
{
	var	element,
		line,
		modelContent,
		modelOrigin,
		modelSaved,
		selectOps;

	var debugMode = (options && options.noDebug) ? false : true;
	var modelClass = (options && options.model) ? options.model : ".mountable-model";
	var modelLength = Object.keys($(table).find(modelClass)).length;
	var modelNewLine = (options && options.addLine && options.addLine.button) ? options.addLine.button : ".mountable-new-line";
	var table = this;

	if (content && content.length)
	{
		if (!$(table).length)
		{
			if (debugMode)
			{
				console.log('MounTable: Table ' + table.selector + ' not found!');
			}
		}
		else
		{
			$.each(content, function (i, line)
			{
				if (line)
				{
					$.each(line, function (j, input)
					{
						if ($.type(input) === 'string' || $.type(input) === 'number')
						{
							element = $(table).find(modelClass).find('input[name="' + j + '[]"], input[name="' + j + '"], select[name="' + j + '[]"], select[name="' + j + '"]');
							if (element.prop('tagName') == "INPUT")
							{
								if (element.attr('type') == 'text')
								{
									element.attr('value', input);
								}
								else if (element.attr('type') == 'checkbox')
								{
									if (element.length > 1)
									{
										$.each(element, function (k, checkbox)
										{
											if (checkbox.value == input)
											{
												checkbox.setAttribute('checked', 'checked');
											}
											else
											{
												checkbox.removeAttribute('checked');
											}
										});
									}
								}
							}
							else if (element.prop('tagName') == "SELECT")
							{
								element.val(input);
								element.children('option').attr('selected', false);
								element.children('option[value="' + input + '"]').attr('selected', 'selected');
							}
						}
						else if ($.type(input) === 'array')
						{
							element = $(table).find(modelClass).find('select[name="' + j + '[]"], select[name="' + j + '"]');
							if (element.prop('tagName') == "SELECT")
							{
								selectOpts = false;
								$.each(input, function(l, value)
								{
									selectOpts += '<option value="' + value + '">' + value + '</option>';
								});
								element.html(selectOpts);
								element.attr('data-mountable-filled-up-selectbox', 'yes');
							};
						}
					});
					modelContent = $(table).find(modelClass).html();
					$(table).find(modelClass).parent().append('<tr>' + modelContent + '</tr>');
					$(table).find(modelClass + ' input').each(function()
					{
						if ($(this).prop('type') == "text")
						{
							$(this).attr('value', "");
						}
						else if ($(this).prop('type') == "checkbox")
						{
							$(this).each(function()
							{
								$(this).attr('checked', false);
							});
						}
					});
					$(table).find(modelClass + ' select').each(function()
					{
						$(this).find('option').each(function()
						{
							$(this).removeAttr('selected');
						});
						$(this).attr('value', "");
						if ($(this).attr('data-mountable-filled-up-selectbox') == 'yes')
						{
							$(this).html(' ');
						}
					});
				}
			});
		}

		modelSaved = '<tr>' + $(table).find(modelClass).html() + '</tr>';
		modelOrigin = $(table).find(modelClass).parent();

		if (debugMode)
		{
			console.log('MounTable: content successfully mounted on ' + table.selector);
		}

		deleteLine = function ()
		{
			if (options && options.deleteLine && options.deleteLine.button)
			{
				$(options.deleteLine.button).off('click').on('click', function()
				{
					if (options.deleteLine.onClick && $.type(options.deleteLine.onClick) === "function")
					{
						if (options.deleteLine.onClick() === true)
						{
							$(this).parent().parent().remove();
						}
					}
					else
					{
						$(this).parent().parent().remove();
					}

				});
			}
		};

		$(modelNewLine).off('click').on('click', function()
		{
			modelOrigin.append(modelSaved);
			deleteLine();
			if (options.addLine.onClick && $.type(options.addLine.onClick) === "function")
			{
				options.addLine.onClick();
			}
		});

		deleteLine();

		$(table).find(modelClass).remove();

	}
};