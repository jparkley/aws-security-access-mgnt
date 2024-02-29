const AWS = require('aws-sdk');

AWS.config.getCredentials(function(err) {
  if (err) console.log('ERROR:', err.stack);
  // else {
  //   console.log("access key: ", AWS.config.credentials)
  // }
});
// console.log('region', AWS.config.region);


async function accessTest() {

  try {

    // const accessKey = "access-key";
    // const secretKey = "secret-key";

    AWS.config.update({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      region: "us-east-1"
    });

    // const bucketName = "bucket-name";
    let s3 = new AWS.S3();    

    const roleArn = 'role-arn';    
    // const sessionPolicy = {
    //   Version: 2012-10-17,
    //   Statement: [
    //       {
    //           Effect: Allow,
    //           Action: "s3:GetObject",
    //           Resource: `arn:aws:s3:::${bucketName}/*`,
    //       }
    //   ]
    // }

    const sts = new AWS.STS();
    const assumeRole =  await sts.assumeRole({
        RoleArn: roleArn,
        RoleSessionName: "AssumeRoleSession",
      }).promise();

      console.log('------------ assumeRole:', assumeRole)
    // using temporary credentials from assumeRole
    s3 = new AWS.S3({
      accessKeyId: assumeRole.Credentials.AccessKeyId,
      secretAccessKey: assumeRole.Credentials.SecretAccessKey,
      sessionToken: assumeRole.Credentials.SessionToken,
    })


    // TEST: get images
    try {
      const params = {
        Bucket: bucketName,
        Key: "mountain/mountain-01.jpg"
      }
      const dataMountain = await s3.getObject(params).promise();
      console.log('***** Mountain *****', dataMountain);
    }
    catch (err) {
      console.log('ERROR in getting moutain image')
    }

    try {
      const params = {
        Bucket: bucketName,
        Key: "ocean/ocean-01.jpg"
      }
      const dataOcean = await s3.getObject(params).promise();
      console.log('***** Ocean *****', dataOcean);
    }
    catch (err) {
      console.log('ERROR in getting ocean image')
    }
  } catch (error) {
    console.error(error)
  }
}

accessTest();
