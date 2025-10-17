import { Controller, Get, Post } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('v1/feed')
export class FeedController {

    constructor(private readonly feedsService: FeedService){}

    @Get()
    getPosts(){
        return this.feedsService.handleGetPosts()
    }

    @Post()
    createPost(){
        return this.feedsService.handleCreatePost()
    }

    @Post()
    likePost(){
        return this.feedsService.handleLikePost()
    }

    @Post()
    commentOnPost(){
        return this.feedsService.handleCommentOnPost()
    }

    
}
