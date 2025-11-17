import { Create_funding_application_dto } from '@mixafrica/shared/validation/funding-application.dto';
import { apiPrivate } from '.';

export const submitFundingApplication = async (
  data: Create_funding_application_dto,
) => {
  try {
    const formData = new FormData();
    
    for (const key in data ) {
      if (key !== 'statement' as keyof Create_funding_application_dto) {
        formData.append(key, String(data[key as keyof Create_funding_application_dto])); 
      }
    }

    const fileAsset = data.statement as any;

    if (fileAsset && fileAsset.uri) {
        const fileUploadObject = {
            uri: fileAsset.uri,
            name: fileAsset.name || fileAsset.fileName || fileAsset.uri.split('/').pop(),
            type: fileAsset.mimeType || fileAsset.type || 'application/octet-stream',
        };

        formData.append('statement', fileUploadObject as any);
    }

    const res = await apiPrivate.post(`/funding/apply`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });

    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { success: false, message: err.response.data.message, data: null };
    } else {
      return { success: false, message: err.message, data: null };
    }
  }
};