const imgLike = document.querySelectorAll('.likeClick')
const likeCount = document.querySelectorAll('.likecount')
const posts = document.querySelectorAll('.click__theme')

// posts.forEach(post => {
//     post.addEventListener('click', async (event) => {
//         const id = post.dataset.id

//         await fetch('/post/'+ id, {
//             method: 'get'
//         })
//     })
// })

imgLike.forEach(img => {    
    img.addEventListener('click', async (event) => {
        const id = event.target.dataset.id
        likeCount.forEach(span => span.dataset.id == id ? span.textContent = +span.textContent + 1 : span)

        await fetch('/like' + id, {
            method: 'post'
        })
        
    })
})