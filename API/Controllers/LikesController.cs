using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikeRepository _likeRepository;

        public LikesController(IUserRepository userRepository, ILikeRepository likeRepository)
        {
            _likeRepository = likeRepository;
            _userRepository = userRepository;
        }

        [HttpPost("{username}")]

        public async Task<IActionResult> AddLike(string username)
        {
            var sourceUserId = Convert.ToInt32(User.GetUserId());
            var likesUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likeRepository.GetUserWithLikes(sourceUserId);

            if (likesUser == null) return NotFound();

            if (sourceUser.UserName == username) return BadRequest("You cannot like yourself ");

            var userLike = await _likeRepository.GetUserLike(sourceUserId, likesUser.Id);

            if (userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likesUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to like user");

        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {

            likesParams.UserId = User.GetUserId();
            var user = await _likeRepository.GetUserLikes(likesParams);
            Response.AddPaginationHeader(new PaginationHeader(user.CurrentPage,user.PageSize,user.TotalCount,user.TotalPages));
            return Ok(user);

        }


    }
}