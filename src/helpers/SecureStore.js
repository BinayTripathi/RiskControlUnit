import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

export const secureSave = (key, value) => {
    //console.log(`secure save called ${key} ${value}`)
    RNSecureStorage.set(key, value, {accessible: ACCESSIBLE.WHEN_UNLOCKED})
    .then((res) => {
    console.log(res);
    }, (err) => {
    console.log(err);
    });
}

/*export const secureGet = async (key) => {
    try{
    let val = await RNSecureStorage.get(key)
    return val
    } catch( err) {
        console.log(err)
    }

}*/

export const secureGet = async (key) => {
    return RNSecureStorage.get(key).then((res) => {
        return res
    }).catch((err) => {
        console.log(err);
    });
}

export const secureRemove = (key) => {
    RNSecureStorage.remove(key).then((val) => {
        console.log(val)
        }).catch((err) => {
        console.log(err)
        });
}