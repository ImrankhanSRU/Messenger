import obj from '../../components/config'

const controller = new AbortController()
const signal = controller.signal

export const uploadAttachment = async (file, topic, sender, sname) => {
    let data = new FormData();
    data.append("file", {
        uri: file.uri,
        type: file.type,
        name: file.name,
    });
    data.append("topic", topic)
    data.append("sender", sender)
    data.append("sname", sname)
    // console.log(data)
    const response = await fetch(`${obj.BASE_URL}api/controlCenter/messenger/uploadFiles`, {
        method: 'POST',
        signal,
        headers: new Headers({
            "Accept": "application/x-www-form-urlencoded",
        }),
        body: data
    })
    const json = await response.json()
    return json
}

export const abortFetching = () => {
    console.log('Now aborting');
    controller.abort()
}




