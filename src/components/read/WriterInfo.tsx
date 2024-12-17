import {EIcon} from "@/types/enums/common-enum";
import {IMG} from "@/contants/common";
import {profileCont, profilePicPath, userName} from "@/types/enums/user-enum";

import Icons from "@/components/Icons";
import styles from './WriterInfo.module.scss';

interface Props {
    author: string;
}

const WriterInfo = ({ author }: Props) => {
    const name = userName[author as keyof typeof userName];
    const profileContent = profileCont[author as keyof typeof profileCont];
    const profilePicture = profilePicPath[author as keyof typeof profilePicPath];
    
    return (
        <div className={styles.baseContainer}>
            <div className={styles.avatarContainer}>
                {profilePicture ?
                    <Icons iconType={EIcon.Avatar} width={62} height={62} fill={IMG.DefaultPath + profilePicture}/> :
                    <Icons iconType={EIcon.Avatar} width={62} height={62} fill={'#C0C0C0'}/>
                }
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.username}>
                    {name ? name : 'user'}
                </div>
                <div className={styles.desc}>
                    {profileContent ? profileContent : 'desc'}
                </div>
            </div>
        </div>
    )
}

export default WriterInfo;

