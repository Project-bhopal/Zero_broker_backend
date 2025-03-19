const parseFields = (body, files) => {
    const parsedData = { ...body };
  
    const parseJSON = (data, defaultValue) => {
      try {
        return JSON.parse(data || "[]");
      } catch (error) {
        return defaultValue;
      }
    };
  
    parsedData.other_amenities = parseJSON(body.other_amenities, []);
    parsedData.features_amenities = parseJSON(body.features_amenities, []);
    parsedData.nearby_buildings = parseJSON(body.nearby_buildings, []);
    parsedData.contact_options = parseJSON(body.contact_options, []);
    parsedData.tags = parseJSON(body.tags, []);
  
    parsedData.building_information = body.building_information || {};
    parsedData.details = body.details || {};
    parsedData.location = body.location || {};
  
    const images = files?.images?.map(file => file.filename) || [];
    const videos = files?.videos?.map(file => file.filename) || [];
    const baseUrl = `${body.protocol || 'http'}://${body.host || 'localhost'}`;
  
    const imageUrls = images.map(filename => `${baseUrl}/uploads/images/${filename}`);
    const videoUrls = videos.map(filename => `${baseUrl}/uploads/videos/${filename}`);
  
    if (!parsedData.developer_notes) parsedData.developer_notes = {};
    if (!parsedData.developer_notes.images) parsedData.developer_notes.images = [];
    if (!parsedData.developer_notes.videos) parsedData.developer_notes.videos = [];
  
    parsedData.developer_notes.images.push(...imageUrls);
    parsedData.developer_notes.videos.push(...videoUrls);
    parsedData.developer_notes.image_count = parsedData.developer_notes.images.length;
    parsedData.developer_notes.video_count = parsedData.developer_notes.videos.length;
  
    return parsedData;
  };
  
  module.exports = parseFields;
  