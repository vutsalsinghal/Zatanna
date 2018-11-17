import aws4 from 'aws4';
import configuration from './config';

export function awsSigning(reqParam, path) {
	let signedRequest = aws4.sign({
  		host: 'gz6lwrr0z9.execute-api.us-east-1.amazonaws.com/',
		method:'POST',
		url:'https://gz6lwrr0z9.execute-api.us-east-1.amazonaws.com/' + path,
		headers: {
			'content-type': 'application/json',
			'x-api-key':configuration.apiKey,
		},
		
		secretAccessKey: configuration.accessKeyId,
		accessKeyId: configuration.secretAccessKey,
		data:reqParam,
		body:reqParam
	})

	delete signedRequest.headers['Host']
	delete signedRequest.headers['Content-Length']
		
	return signedRequest;
};
