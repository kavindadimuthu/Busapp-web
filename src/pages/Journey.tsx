import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorMessage from "../components/shared/ErrorMessage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getJourneyById } from "../utils/apiHelper";
import type { Journey as JourneyType } from "../utils/type";

import JourneyHeader from "../components/journey/JourneyHeader";
import JourneyRoute from "../components/journey/JourneyRoute";
import JourneySchedule from "../components/journey/JourneySchedule";
import BusInfo from "../components/journey/BusInfo";
import RouteMap from "../components/journey/RouteMap";

const Journey = () => {
  const { id } = useParams();
  const [journey, setJourney] = useState<JourneyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchJourney = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const journeyData = await getJourneyById(id);
        setJourney(journeyData);
      } catch (err) {
        console.error("Error fetching journey:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch journey")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [id]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 z-50 bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <Header />
      </div>
      
      <div className="pt-16">
        {/* Empty div for spacing to account for fixed header */}
        <div className="h-4"></div>
        
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="container mx-auto p-4">
            <ErrorMessage message="Failed to load journey details. Please try again later." />
          </div>
        ) : !journey ? (
          <div className="container mx-auto p-4">
            <ErrorMessage message="No journey found with this ID." />
          </div>
        ) : (
          <div className="container mx-auto p-4 max-w-5xl">
            <div>
              <JourneyHeader
                busName={journey.bus_name || "Unknown Bus"}
                operatorName={journey.operator_name || "Unknown Operator"}
                busType={journey.bus_type || "Standard"}
                routeName={journey.route_name || "Unknown Route"}
              />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                <div className="lg:col-span-3">
                  <JourneyRoute
                    stops={journey.stops || []}
                    stopTimes={journey.stop_times || []}
                  />
                </div>
                <div className="lg:col-span-2">
                  <JourneySchedule
                    departureTime={journey.departure_time || ""}
                    arrivalTime={journey.arrival_time || ""}
                    daysOfWeek={journey.days_of_week || []}
                    validFrom={journey.valid_from || ""}
                    validUntil={journey.valid_until || null}
                    totalDuration={journey.total_duration || 0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <BusInfo
                    busNumber={journey.bus_number || ""}
                    busName={journey.bus_name || ""}
                    busType={journey.bus_type || ""}
                    operatorName={journey.operator_name || ""}
                    contactInfo={journey.contact_info || ""}
                    fare={journey.fare || "0"}
                  />
                </div>
                <div className="lg:col-span-2">
                  <RouteMap stops={journey.stops || []} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Journey;