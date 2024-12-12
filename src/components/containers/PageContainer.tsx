import styles from "./PageContainer.module.scss";

type Props = {
    children: string | React.ReactNode;
}

const PageContainer = ({children}: Props) => {
    return (
        <div className={styles.baseContainer}>{children}</div>
    );
}


export default PageContainer;
