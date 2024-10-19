import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Error "mo:base/Error";
import Debug "mo:base/Debug";

actor class ReportAndReward() {
    type ReportData = {
        id : Nat;
        reporter : Principal;
        description : Text;
        location : Text;
        evidenceLink : Text; // IPFS hash of the evidence
        verified : Bool;
        reward : Nat;
        timestamp : Int;
    };

    var reports : [var ReportData] = [var];
    var reportCount : Nat = 0;
    var owner : Principal = Principal.fromText("eyo6z-issqf-4scrh-xyziz-cbp6q-l7f3p-u4wbi-ts5kn-rw64z-mcitf-hqe");

    public shared(msg) func submitReport(description : Text, location : Text, evidenceLink : Text) : async Nat {
        let id = reportCount;
        let newReport : ReportData = {
            id = id;
            reporter = msg.caller;
            description = description;
            location = location;
            evidenceLink = evidenceLink;
            verified = false;
            reward = 0;
            timestamp = Time.now();
        };

        reports := Array.thaw(Array.append(Array.freeze(reports), [newReport]));
        reportCount += 1;

        id
    };

    public shared(msg) func verifyReport(id : Nat, newReward : Nat) : async Text {
        Debug.print("Caller principal: " # Principal.toText(msg.caller));
        Debug.print("Owner principal: " # Principal.toText(owner));
        
        if (msg.caller != owner) {
            return "Error: Only the owner can verify reports. Caller: " # Principal.toText(msg.caller) # ", Owner: " # Principal.toText(owner);
        };
        
        if (id >= reportCount) {
            return "Error: Invalid report ID";
        };

        let oldReport = reports[id];
        if (oldReport.verified) {
            return "Error: Report already verified";
        };

        let updatedReport : ReportData = {
            id = oldReport.id;
            reporter = oldReport.reporter;
            description = oldReport.description;
            location = oldReport.location;
            evidenceLink = oldReport.evidenceLink;
            verified = true;
            reward = newReward;
            timestamp = oldReport.timestamp;
        };

        reports[id] := updatedReport;

        "Report verified successfully"
    };

    public query func getReportsByAddress(reporter : Principal) : async [ReportData] {
        Array.filter(Array.freeze(reports), func (report : ReportData) : Bool {
            report.reporter == reporter
        })
    };

    public query func getAllReports() : async [ReportData] {
        Array.freeze(reports)
    };

    public query func getOwner() : async Principal {
        owner
    };

    public shared(msg) func setOwner(newOwner : Principal) : async Text {
        if (msg.caller != owner) {
            return "Error: Only the current owner can set a new owner";
        };
        owner := newOwner;
        "Owner updated successfully"
    };
}