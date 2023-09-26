import { Image as ImageCompressor, Video as VideoCompressor, Audio as AudioCompressor, getVideoMetaData, getRealPath } from 'react-native-compressor';
import { getPercentage } from './helpersFunction';

export const compressImage = async () => {
    const result = await ImageCompressor.compress(
        'file://path_of_file/image.jpg', 
        {
            maxWidth: 1000,
            compressionMethod: 'auto',
            quality: 0.8
        }
    );
    return result;
}

export const compressAudio = async () => {
    const result = await AudioCompressor.compress(
        'file://path_of_file/file_example_MP3_2MG.mp3', 
        {
            quality: 'medium',
        }
    );
    return result;
}

export const compressVideo = async (file_uri, call_action=undefined, settter_progress=undefined) => {
    const result = await VideoCompressor.compress(
        file_uri,
        {
            compressionMethod: 'auto',
            minimumFileSizeForCompress: 1,
            getCancellationId: (cancellationId) => {
                if(call_action!=undefined) {
                    call_action(cancellationId)
                }
            }
        },
        (progress) => {
            // console.log('Compression progress: ', progress );
            if(settter_progress!==undefined) {
                // console.log('polo');
                settter_progress(progress)
            }
        }
    );
    return result;
}

export const cancelCompression = (cancellationVideoCompressId) => {
    VideoCompressor.cancelCompression(cancellationVideoCompressId)
}

export const uploadBegin = (response) => {
    var jobId = response.jobId;
    console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    return jobId
};

export const uploadProgress = (response) => {
    var percentage = getPercentage(response.totalBytesSent, response.totalBytesExpectedToSend);
    // console.log('UPLOAD IS ' + percentage + '% DONE!');
    return percentage;
};