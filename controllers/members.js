module.exports = function(async, Users){
    return {
        AccessMembers: function(router){
                       
            router.get('/members', this.viewMembers);
            router.post('/members', this.searchMembers);
        },
                 
        viewMembers: function(req, res){
            async.parallel([
                function(callback){
                    Users.find({}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('members', {title: 'Social chat', user: req.user, chunks: dataChunk});
            })
        },
        
        searchMembers: function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.username), 'gi');
                    
                    Users.find({'username': regex}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('members', {title: 'Social Chat', user: req.user, chunks: dataChunk});
            })
        }
    }
}











