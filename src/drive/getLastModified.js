export default async function(fileId) {
  const self = this;

  // Set up function for recursion
  const listRevisions = async(fileId, pageToken) => {
    return new Promise((resolve, reject) => {
      self.driveAPI.revisions.list({
        auth: self.client,
        pageSize: 200,
        fileId,
        pageToken,
      }, (err, resp) => {
        if (err) { reject(err); };
        resolve(resp.data);
      });
    });
  };

  // Set up data holders
  let pageToken;
  let result = await listRevisions(fileId, pageToken);
  pageToken = result.nextPageToken;

  // Handle recursion of paginated
  while (pageToken !== undefined) {
    result = await listRevisions(fileId, pageToken);
    pageToken = result.nextPageToken;
  };

  // Sort, filter, return  the latest modifiedTime
  const lastModifiedTimeStr = result.revisions
    .sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime))[0]
    .modifiedTime;

  return new Date(lastModifiedTimeStr);
}
