import { ILogger, LogLevel } from "@microsoft/signalr";

export class ServerLogger implements ILogger
{
	public log(logLevel: LogLevel, message: string): void
	{
		let txt_color: string;
		let bg_color: string = '023047';

		switch (logLevel)
		{
			case LogLevel.Information:
				txt_color = 'ffffff';
				break;
			
			case LogLevel.Debug:
				txt_color = '219ebc';
				break;
			
			case LogLevel.Warning:
				txt_color = 'ffbe0b';
				break;
			
			default:
				txt_color = 'ffb703';
				break;
		}

		if (logLevel == LogLevel.Error)
		{
			console.error(`${LogLevel[ logLevel ]} - ${message} %c=> %cSignalR`, 'color: #ffb703', 'color: rgba(0, 183, 255, 1)');
		}
		else
		{
			console.debug(`%c${LogLevel[logLevel]} - ${message}`, `background: #${bg_color}; color: #${txt_color};`);
		}
	}
}