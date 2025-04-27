import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashLayout from "../Admin/AdminDashLayout";
import Layout from "../Common/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getRouteById } from "../../Store/Slices/Transportation/RoutesManagment/routes.action";

const StoppageList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleRoute } = useSelector((state) => state.transportation.transportRoute);
  
  useEffect(() => {
    dispatch(getRouteById(id));
  }, [id]);

  const stoppages = singleRoute?.stops || [];

  return (
    <Layout>
      <DashLayout>
        <div className="p-6">

          {/* Heading with Back Icon */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Stoppages for Route <span className="text-blue-500">{singleRoute?.routeName}</span>
            </h2>
          </div>

          {/* Stoppage List */}
          <div className="relative pl-8">
            {/* Vertical Dashed Line */}
            <div className="absolute top-0 left-4 bottom-0 border-l-2 border-dashed border-blue-400"></div>

            <div className="flex flex-col gap-8">
              {stoppages.map((stop, index) => {
                const isFirst = index === 0;
                const isLast = index === stoppages.length - 1;
                return (
                  <div key={stop._id} className="relative flex items-start gap-4">
                    <div className="w-4 h-4 mt-1.5 rounded-full bg-blue-500 border-2 border-white z-10 shadow-md"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{stop.stopName}</h3>
                        {isFirst && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Start</span>
                        )}
                        {isLast && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">End</span>
                        )}
                      </div>

                      {/* Latitude and Longitude */}
                      {stop.location?.lat && stop.location?.lng && (
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Lat:</strong> {stop.location.lat}, <strong>Lng:</strong> {stop.location.lng}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </DashLayout>
    </Layout>
  );
};

export default StoppageList;
