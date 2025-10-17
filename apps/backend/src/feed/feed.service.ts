import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedService {

    async handleGetPosts(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleCreatePost(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleLikePost(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }

    async handleCommentOnPost(){
        return {
            success: true,
            message: '',
            data: [],
        }
    }
}
