import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLeftHeading } from "../../Store/Slices/Common/User/reducers/userSlice";

const useNavHeading = (heading, subheading) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLeftHeading([heading, subheading]));
  }, [dispatch, heading, subheading]); // Effect runs only when `heading` or `subheading` changes
};

export default useNavHeading;
