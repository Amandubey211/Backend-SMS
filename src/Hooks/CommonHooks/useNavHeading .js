import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLeftHeading } from "../../Redux/Slices/Common/CommonSlice";

const useNavHeading = (heading, subheading, defaultHeading = ["Students"]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLeftHeading([heading, subheading]));

    return () => {
      dispatch(setLeftHeading(defaultHeading));
    };
  }, [dispatch, heading, subheading, defaultHeading]);
};

export default useNavHeading;
