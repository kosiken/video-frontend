import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import UserApiSignleton from '../api/userApi';
import { VideoComment } from '../models/Video';
import CircularProgress from '@mui/material/CircularProgress';

const CommentComponent: React.FC<{ videoId: string; }> = function ({ videoId }) {

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [comments, setComments] = useState<VideoComment[]>([])
    const [hasError, setHasError] = useState(false)
    const [body, setBody] = useState('')


    const handleSubmit = async () => {
        setLoading2(true)
        const Api = UserApiSignleton();

        try {
            let c = await Api.addComment(videoId, body);
            setComments([c, ...comments]);
            setBody('')
        } catch (error) {
            alert("An error occured");
        }
        setLoading2(false);

    }
    const retry = async () => {
        setHasError(false);
        setLoading(true);


        const Api = UserApiSignleton();
        try {
            let c = await Api.getComments(videoId);
            setComments(c);

        }
        catch (err) {
            setHasError(true);
        }
        setLoading(false);
    }
    useEffect(() => {
        const func = async () => {
            setLoading(true)
            const Api = UserApiSignleton();
            try {
                let c = await Api.getComments(videoId);
                setComments(c);

            }
            catch (err) {
                setHasError(true);
            }
            setLoading(false);
        }
        func();
    }, [videoId])



    return (

        <Paper elevation={0}>
            {loading2 && <LinearProgress />}
            <Box padding="1em">


                <TextField

                    rows={3}
                    multiline
                    margin="dense"
                    id="comment"
                    label="Comment"
                    type="text"
                    fullWidth
                    value={body}
                    onChange={(e) => {
                        setBody(e.target.value)
                    }}
                    variant="standard"
                    InputProps={{
                        endAdornment:
                            (<InputAdornment position="end">
                                <IconButton
                                    disabled={body.length === 0}
                                    onClick={handleSubmit}

                                >
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>)

                    }}
                />
          <div style={{marginBottom: '2em'}}/>
          <Typography fontWeight="bold" sx={{mb: 2}}> Comments</Typography>

                {comments.map((c, i) => {
                    let { user } = c;
                    return (
                        <Box display="flex" key={'comment-' + i} sx={{mb: 2}}>

                            <div style={{padding: '0 1.5em'}}>
                                <Avatar
                                    sx={{ width: 30, height: 30 }}
                                    alt={user.fullName}
                                    src={user.profilePic}
                                />
                            </div>

                            <Typography paragraph>{c.body}</Typography>
                        </Box>
                    )
                })}

                {loading && <CircularProgress />}

                {hasError && (
                    <Box style={{ padding: '1em' }}>
                        <Typography sx={{ mb: 2 }}>An error occurred</Typography>
                        <Button onClick={retry}></Button>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}

export default CommentComponent;