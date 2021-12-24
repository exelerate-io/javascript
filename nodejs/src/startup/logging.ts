import winston from 'winston';

const { format, transports } = winston;

const logging = () => {
	process.on('unhandledRejection', (ex) => {
		throw ex;
	});

	process.on('uncaughtException', (error: Error) => {
		winston.error(error);
	});

	winston.add(
		new transports.Console({
			format: format.combine(format.json(), format.colorize()),
		}),
	);
	winston.exceptions.handle(
		new transports.Console({
			format: format.combine(format.json(), format.colorize()),
		}),
	);

	if (env === 'local' || env === 'dev') {
		winston.add(
			new transports.File({
				filename: 'logs/server.log',
				format: winston.format.combine(
					format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
					format.align(),
					format.printf(
						(info) =>
							`${info.level}: ${[info.timestamp]}: ${
								info.message
							}`,
					),
				),
			}),
		);

		winston.exceptions.handle(
			new transports.File({
				filename: 'logs/exceptions.log',
				handleExceptions: true,
			}),
		);
	}
};

export default logging;
