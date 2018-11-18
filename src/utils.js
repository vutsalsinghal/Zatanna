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

export const genreOptions = [
  {key:'country',text:'Country',value:1},
  {key:'classical',text:'Classical',value:2},
  {key:'electronic',text:'Electronic',value:3},
  {key:'hiphop',text:'Hip-Hop',value:4},
  {key:'rap',text:'Rap',value:5},
  {key:'jazz',text:'Jazz',value:6},
  {key:'latin',text:'Latin',value:7},
  {key:'opera',text:'Opera',value:8},
  {key:'pop',text:'Pop',value:9},
  {key:'rbsoul',text:'R&B/Soul',value:10},
  {key:'reggae',text:'Reggae',value:11},
  {key:'rock',text:'Rock',value:12},
  {key:'metal',text:'Metal',value:13},
  {key:'blues',text:'Blues',value:14},
  {key:'dance',text:'Dance',value:15}
]