import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import LinearProgress from '@mui/material/LinearProgress';

import Typography from "@mui/material/Typography";
import ApiLoader from "../../components/ApiLoader";
import Paper from "@mui/material/Paper";
import Centered from "../../components/Centered";
import Container from "@mui/material/Container";
import { useParams, Redirect } from "react-router";
import UserApiSignleton from "../../api/userApi";
import Video from "../../models/Video";
import LoadingPageIndicator from "../../components/LoadingPageIndicator";


const Purchase = () => {
    let { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [video, setVideo] = useState<Video>();

    const [accessCode, setAccessCode] = useState<string>();

    const purchaseVideo = async() => {
        const Api = UserApiSignleton();
        try {
            if(video){
                setLoading2(true)
          let p = await  Api.purchase(video.id);
          console.log(p);
          setAccessCode(p.accessCode);
        }
        }catch(error: any) {
            if(error.response) {
            if(error.response.data.problems)    alert(error.response.data.problems);
            }
        }

        setLoading2(false)
    }

    const getVideo = async () => {
        const Api = UserApiSignleton();

        setLoading(true);
        try{
        const p = await Api.checkForAccess(id);
        window.location.pathname = '/main/restricted/' + p.accessCode;
      
      }
      catch(err) {

      }
        let v = await Api.getRestrictedVideo("lion", id);
        setVideo(video)
        setLoading(false)
        return v;



    }



    const getBody = () => {
        if (loading) return <LoadingPageIndicator />;

        if (video && (!accessCode)) {
            return (<Centered sx={{ height: '100vh', width: '100%' }}>
                <Paper style={{  textAlign: 'center', minWidth: "270px" }} elevation={3}>
                    {loading2 && <LinearProgress />}

                    <div style={{padding: '2em',}}>
                    <img style={{ width: '100%', maxWidth: 350 }} alt="Become a creator" src={video.thumbnail} />

                    <Typography align="center" sx={{ mt: 2, mb: 2 }} variant="h6">
                        Purchas Video
                    </Typography>
                    <Typography align="center" sx={{ mt: 2, mb: 2 }} color="GrayText">
                        (NGN){video.price}
                    </Typography>
                    <Button onClick={purchaseVideo}  variant="contained">Purchase</Button>

                    </div>

                </Paper>
            </Centered>)
        }
        if (accessCode) return <Redirect to={`/main/restricted/${accessCode}`} />

        return (<Centered sx={{ height: '100%' }}>
            <Paper style={{ padding: '2em', textAlign: 'center' }} elevation={3}>
                <img style={{ width: '100%', maxWidth: 350 }} alt="Become a creator" src="/images/share.png" />



                <Typography align="center" sx={{ mt: 2, mb: 2 }} >
                    An Error occurred          </Typography>

            </Paper>
        </Centered>)


    }

    return (
        <Container maxWidth="md" style={{ maxHeight: 'calc(100vh )', overflow: 'hidden', paddingTop: '64px' }} sx={{ position: "relative", display: { sm: "block", md: "flex" } }}>

            {getBody()}


            <ApiLoader setLoading={setLoading} request={getVideo} onLoad={(v) => {
                console.log(v);
                setVideo(v as Video);
                setLoading(false);
            }} />
        </Container>
    )
}

export default Purchase
